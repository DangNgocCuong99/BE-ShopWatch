import nodemailer from "nodemailer";
import { accountStatusType } from "../ulti/types";
import UserModel from "../model/user";
import { dataReturn, errorReturn, getErrorMessage } from "../ulti/hook";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../ulti/appError";
import mongoose from "mongoose";

const transporter = (user: string, pass: string) =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: user,
      pass: pass,
    },
  });

const generateOTP = () => {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }

  return otp;
};

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (otp: string, emailTo: string) => {
  console.log("🚀 ~ file: auth.ts:35 ~ sendEmail ~ email:", emailTo);
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

  try {
    // send mail with defined transport object
    const info = await transporter(
      process.env.EMAIL_USER,
      process.env.EMAIL_PASS
    ).sendMail({
      from: `"NAM DUng Watch" ${process.env.EMAIL_USER}`, // sender address
      to: emailTo, // list of receivers
      subject: "Hello ✔", // Subject line
      text: `Mã otp của bạn là ${otp} . OTP sẽ hết hạn sau 1 phút`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });
    console.log(info);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
    console.log(info.messageId);
  } catch (error) {
    console.log(error);
  }
};

export const inputOtp: RequestHandler = async (req, res) => {
  try {
    const { otp, email, password } = req.body;
    const check = await UserModel.findOne({ email: email, password: password });
    if (
      check &&
      check.otp === otp &&
      Date.now() < check.createdAt + 1 * 60 * 1000
    ) {
      const data = await UserModel.findByIdAndUpdate(check._id, {
        status: "active",
        otp: null,
      });
      const token = generateAccessToken(data._id);
      const refreshToken = generateRefreshToken(data._id);
      res.cookie("jwt", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] == "https",
      });
      res.send(dataReturn(token, "Kích hoạt tài khoản thành công"));
    } else {
      res.send(errorReturn("OTP không chính xác hoặc đã hết hạn, vui lòng thử lại !"));
    }
  } catch (error) {
    res.send(error);
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const check = await checkActiveUser(email, password);

    if (check.status) {
      const token = generateAccessToken(check.data.userId);
      const refreshToken = generateRefreshToken(check.data.userId);
      res.cookie("jwt", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] == "https",
      });
      const user = await UserModel.findByIdAndUpdate(check.data.userId,{$set:{refreshToken:refreshToken}})
      res.status(check.statusCode).send(dataReturn({token,role:user.role}, check.message));
    } else {
      res
        .status(check.statusCode)
        .send(errorReturn(check.message, check.statusCode));
    }
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const handleRefreshToken: RequestHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;
    console.log(refreshToken,'1');
    
    if (!refreshToken) {
       res
        .status(401)
        .send(
          errorReturn("You are not authenticated, Please login again!", 401)
        );
        return
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET) as { id: string };
    
    if (!decoded) {
        res
         .status(403)
         .send(
           errorReturn("Refresh token is not valid,Please login again!", 403)
         );
         return
     }

    const currentUser = await UserModel.findById(decoded.id);

    if (currentUser.refreshToken !== refreshToken || !currentUser) {
       res
        .status(403)
        .send(
          errorReturn("Refresh token is not valid,Please login again!", 403)
        );
        return
    }

    const newAccessToken = generateAccessToken(currentUser._id)
    const newRefreshToken = generateRefreshToken(currentUser._id)

    await UserModel.findByIdAndUpdate(currentUser._id,{$set:{refreshToken:newRefreshToken}})
    res.cookie("jwt", newRefreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] == "https",
      })

    res.send(dataReturn({token:newAccessToken}, "Đăng nhập thành công"));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

const checkActiveUser = async (email: string, password: string) => {
  try {
    const check = await UserModel.findOne({ email: email, password: password });
    if (check && check.status === accountStatusType.active) {
      return {
        status: true,
        message: "Đăng nhập thành công",
        data: { userId: check._id },
        statusCode: 200,
      };
    } else {
      return {
        status: false,
        message: "Tài khoản hoặc mật chưa chính xác",
        statusCode: 401,
      };
    }
  } catch (error) {
    console.log(errorReturn(error));
  }
};

export const register: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    const check = await UserModel.findOne({ email: data.email });
    if (check) {
      if (check.status === accountStatusType.active) {
        res.send(errorReturn("Đã tồn tại tài khoản"));
      } else {
        const otp = generateOTP();
        await sendEmail(otp, data.email);
        await UserModel.findOneAndDelete(check._id);
        await UserModel.create({ ...data, otp: otp });
        res.send(dataReturn({ username: data.username }, "Đăng ký thành công"));
      }
    } else {
      const otp = generateOTP();
      await sendEmail(otp, data.email);
      await UserModel.create({ ...data, otp: otp });
      res.send(dataReturn({ username: data.username }, "Đăng ký thành công"));
    }
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const protect: RequestHandler = async (req, res, next) => {
  try {
    let token: string;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req?.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      res.send(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

    const currentUser = await UserModel.findById(decoded.id);
    if (!currentUser) {
      res.send(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }
    res.locals.user = currentUser;
    next();
  } catch (error) {
    res.send(error);
  }
};

export const restrictTo = (...roles: string[]): RequestHandler => {
  return (_req, res, next) => {
    console.log(roles);
    console.log(res.locals.user.role);

    if (!roles.includes(res.locals.user.role)) {
      res.send(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

export const generateAccessToken = (userId: mongoose.Types.ObjectId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN_ACCES_KEY,
  });
};

const generateRefreshToken = (userId: mongoose.Types.ObjectId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN_REFRESH_KEY,
  });
};

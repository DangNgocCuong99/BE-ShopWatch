"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.restrictTo = exports.protect = exports.isLoggedIn = exports.register = exports.login = exports.inputOtp = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const types_1 = require("../ulti/types");
const user_1 = __importDefault(require("../model/user"));
const hook_1 = require("../ulti/hook");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("util");
const appError_1 = require("../ulti/appError");
const transporter = (user, pass) => nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: user,
        pass: pass,
    },
});
const generateOTP = () => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }
    return otp;
};
// async..await is not allowed in global scope, must use a wrapper
const sendEmail = (otp, emailTo) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🚀 ~ file: auth.ts:35 ~ sendEmail ~ email:", emailTo);
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
    try {
        // send mail with defined transport object
        const info = yield transporter(process.env.EMAIL_USER, process.env.EMAIL_PASS).sendMail({
            from: `"shop watch" ${process.env.EMAIL_USER}`,
            to: emailTo,
            subject: "Hello ✔",
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
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendEmail = sendEmail;
const inputOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, email, password } = req.body;
        const check = yield user_1.default.findOne({ 'email': email, 'password': password });
        if (check && check.otp === otp) {
            yield user_1.default.findByIdAndUpdate(check._id, { status: "active", otp: null });
            res.send('Kích hoạt tài khoản thành công');
        }
        else {
            res.send('OTP không chính xác');
        }
    }
    catch (error) {
        res.send(error);
    }
});
exports.inputOtp = inputOtp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const check = yield checkActiveUser(email, password);
        if (check.status) {
            const token = (0, exports.generateAccessToken)(check.data.userId);
            res.send((0, hook_1.dataReturn)(token, check.message));
        }
        else {
            res.send((0, hook_1.errorReturn)(check.message));
        }
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.login = login;
const checkActiveUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const check = yield user_1.default.findOne({ 'email': email, 'password': password });
        console.log("🚀 ~ file: auth.ts:102 ~ checkActiveUser ~ check:", check);
        if (check) {
            if (check.status === types_1.accountStatusType.inactive) {
                return { status: false, message: "Vui lòng kích hoạt tài khoản" };
            }
            else {
                return { status: true, message: 'Đăng nhập thành công', data: { userId: check._id } };
            }
        }
        else {
            return { status: false, message: 'Tài khoản hoặc mật chưa chính xác' };
        }
    }
    catch (error) {
        console.log((0, hook_1.errorReturn)(error));
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const check = yield user_1.default.findOne({ 'email': data.email });
        console.log(check);
        if (check) {
            res.send((0, hook_1.errorReturn)('Đã tồn tại tài khoản'));
        }
        else {
            const otp = generateOTP();
            yield (0, exports.sendEmail)(otp, data.email);
            yield user_1.default.create(Object.assign(Object.assign({}, data), { otp: otp }));
            res.send((0, hook_1.dataReturn)({ username: data.username }, 'Đăng ký thành công'));
        }
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.register = register;
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization.startsWith('Bearer');
        const decoded = yield (0, util_1.promisify)(jsonwebtoken_1.default.verify).bind(token, process.env.JWT_SECRET);
        const currentUser = yield user_1.default.findById(decoded.id);
        if (currentUser) {
            return next();
        }
    }
    catch (error) {
        res.send(error);
    }
});
exports.isLoggedIn = isLoggedIn;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if ((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) {
            res.send(new appError_1.AppError('You are not logged in! Please log in to get access.', 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const currentUser = yield user_1.default.findById(decoded.id);
        if (!currentUser) {
            res.send(new appError_1.AppError('The user belonging to this token does no longer exist.', 401));
        }
        res.locals.user = currentUser;
        next();
    }
    catch (error) {
        res.send(error);
    }
});
exports.protect = protect;
const restrictTo = (...roles) => {
    return (_req, res, next) => {
        console.log(roles);
        console.log(res.locals.user.role);
        if (!roles.includes(res.locals.user.role)) {
            res.send(new appError_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN_ACCES_KEY
    });
};
exports.generateAccessToken = generateAccessToken;
//# sourceMappingURL=auth.js.map
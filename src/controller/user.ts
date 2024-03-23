import { RequestHandler } from "express";
import UserModel from "../model/user";
import { dataReturn, errorReturn, getErrorMessage } from "../ulti/hook";

export const getUser: RequestHandler = async (req, res) => {
  try {
    const name = req.query.name;
    const email = req.query.email;
    const role = req.query.role;
    const activePage = +req.query.page;
    const limit = +req.query.pageSize;
    const skip = (activePage - 1) * limit;

    const query: {
      username?: unknown;
      email?: unknown;
      role?:unknown
    } = {};
    if (name) {
      query.username = { $regex: name, $options: "i" };
    }

    if (email) {
      query.email = { $regex: email, $options: "i" };
    }

    if (role) {
        query.role = role;
      }

    const record = await UserModel.find(query).countDocuments();

    const data = await UserModel.find(query).skip(skip).limit(limit);
    res.send(
      dataReturn({
        items: data,
        total: record,
      })
    );
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};


export const detailUser : RequestHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findOne({_id: id})
        res.send(dataReturn(user))
    } catch (error) {
        res.send(errorReturn(getErrorMessage(error)))
    }
}

export const getCurrentUser : RequestHandler = async (req, res) => {
  try {
      const user = await UserModel.findOne({_id:  res.locals.user._id})
      res.send(dataReturn(user))
  } catch (error) {
      res.send(errorReturn(getErrorMessage(error)))
  }
}

export const updateCurrentUser : RequestHandler = async (req, res) => {
  try {
    const user = await UserModel.findOne({_id:  res.locals.user._id})
    if(!user) return //kiem tra user ton tai
    const body = req.body
    const userData = {...user.toObject(), ...body}
    const data = await UserModel.findByIdAndUpdate(user._id,userData)
    res.send(dataReturn(data))
} catch (error) {
    res.send(errorReturn(getErrorMessage(error)))
}
}

export const changeActiveUser: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id)
    const updateUser = await UserModel.findByIdAndUpdate(id,{isActive:!user.isActive})
    res.send(dataReturn(updateUser))
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)))
}
} 
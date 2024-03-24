import { RequestHandler } from "express";
import VoucherModel from "../model/voucher";
import { dataReturn, errorReturn, getErrorMessage } from "../ulti/hook";

export const getVoucher: RequestHandler = async (req, res) => {
  try {
    const code = req.query.code || "";
    const activePage = +req.query.page;
    const limit = +req.query.pageSize;
    const skip = (activePage - 1) * limit;
    const voucher = await VoucherModel.countDocuments({
      code: { $regex: code, $options: "i" },
    });
    const data = await VoucherModel.find({
      code: { $regex: code, $options: "i" },
    })
      .skip(skip)
      .limit(limit);

    res.send(
      dataReturn({
        items: data,
        total: voucher,
      })
    );
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const createVoucher: RequestHandler = async (req, res) => {
    try {
      const dataVoucher = req.body
      const voucher = await VoucherModel.create(dataVoucher)
      res.send(
        dataReturn(voucher)
      );
    } catch (error) {
      res.send(errorReturn(getErrorMessage(error)));
    }
  };

  export const updateVoucher: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id
      const dataVoucher = req.body
      const voucher = await VoucherModel.findByIdAndUpdate(id,dataVoucher)
      res.send(
        dataReturn(voucher)
      );
    } catch (error) {
      res.send(errorReturn(getErrorMessage(error)));
    }
  };

  export const detailVoucher: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id
      const voucher = await VoucherModel.findById(id)
      res.send(
        dataReturn(voucher)
      );
    } catch (error) {
      res.send(errorReturn(getErrorMessage(error)));
    }
  };

  export const deleteVoucher: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id
      const voucher = await VoucherModel.findByIdAndDelete(id)
      res.send(
        dataReturn(voucher)
      );
    } catch (error) {
      res.send(errorReturn(getErrorMessage(error)));
    }
  };

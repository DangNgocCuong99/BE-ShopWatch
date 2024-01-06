import { RequestHandler } from "express";
import cartModel from "../model/cart";
import ProductModel from "../model/product";
import { dataReturn, errorReturn, getErrorMessage } from "../ulti/hook";

export const getCart: RequestHandler = async (req, res) => {
  try {
    const data = await cartModel.find({ userId: res.locals.user._id });

    const listIdProduct = data.map((i) => i.productId);
    const dataProduct = await ProductModel.find({
      _id: {
        $in: listIdProduct,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cloneArr: any[] = [...dataProduct];

    const dataRe = cloneArr.map((i) => {
      return {
        ...i._doc,
        quantity: data.find((j) => j.productId.equals(i._id)).quantity,
      };
    });

    res.send(dataReturn(dataRe));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const addCart: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.body;
    const checkTrung = await cartModel.findOne({
      userId: res.locals.user._id,
      productId: productId,
    });
    if (checkTrung) {
      const data = await cartModel.findByIdAndUpdate(checkTrung._id, {
        quantity: checkTrung.quantity + 1,
      });
      res.send(dataReturn(data, "update thanh cong"));
    } else {
      const data = await cartModel.create({
        productId: productId,
        quantity: 1,
        userId: res.locals.user._id,
      });
      res.send(dataReturn(data, "them moi thanh cong"));
    }
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

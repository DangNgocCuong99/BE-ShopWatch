import { RequestHandler } from "express";
import favoriteModel from "../model/favorite";
import { dataReturn, errorReturn, getErrorMessage } from "../ulti/hook";
import ProductModel from "../model/product";
import trademarkModel from "../model/trademark";

export const getFavorite: RequestHandler = async (req, res) => {
  try {
    
    const activePage = +req.query.page;
    const limit = +req.query.pageSize;
    const skip = (activePage - 1) * limit;
    const record = await favoriteModel.countDocuments({
      userId: res.locals.user._id,
    });
    const data = await favoriteModel
      .find({ userId: res.locals.user._id })
      .skip(skip)
      .limit(limit);

    const listIdProduct = data.map((i) => i.productId);
    const dataProduct = await ProductModel.find({
      _id: {
        $in: listIdProduct,
      },
    });

    const idTrademark = dataProduct.map((i) => i.trademarkId);
    const listTrademark = await trademarkModel.find({
      _id: { $in: idTrademark },
    });

    const dataR = dataProduct.map((i) => {
      return {
        ...i.toObject(),
        trademark: listTrademark.find(
          (value) => value._id.toString() == i.trademarkId
        ),
        favorite: true,
        isNewProject: i.isNewProject  
      };
    });

    res.send(dataReturn({
        items: dataR,
        total: record,
      }));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const handleFavorite: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.body;
    const checkTrung = await favoriteModel.findOne({
      userId: res.locals.user._id,
      productId: productId,
    });
    if (checkTrung) {
      const data = await favoriteModel.findByIdAndDelete(checkTrung._id);
      res.send(dataReturn(data, "huy yeu thich thanh cong"));
    } else {
      const data = await favoriteModel.create({
        userId: res.locals.user._id,
        productId: productId,
      });
      res.send(dataReturn(data, "them yeu thich thanh cong"));
    }
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

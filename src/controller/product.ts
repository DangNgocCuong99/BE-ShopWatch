import { RequestHandler } from "express";
import productModel from "../model/product";
import { dataReturn, errorReturn, getErrorMessage } from "../ulti/hook";
import trademarkModel from "../model/trademark";
import ViewModel from "../model/viewProcduct";
import FavoriteModel from "../model/favorite";
// import FavoriteModel from "../model/favorite"

export const getMangageProduct: RequestHandler = async (req, res) => {
  try {
    console.log(res.locals.user._id);
    
    const userId = res.locals.user._id
    const name = req.query.name || "";
    const activePage = +req.query.page;
    const limit = +req.query.pageSize;
    const skip = (activePage - 1) * limit;
    const record = await productModel.countDocuments({
      name: { $regex: name, $options: "i" },
    });
    const data = await productModel
      .find({ name: { $regex: name, $options: "i" } })
      // .sort({ createdAt: -1 }) lay ra create at moi nhat
      .skip(skip)
      .limit(limit);


      const favorites = await FavoriteModel.find({ userId });
      const favoriteProductIds = new Set(favorites.map(favorite => favorite.productId.toString()));

    const idTrademark = data.map((i) => i.trademarkId);
    const listTrademark = await trademarkModel.find({
      _id: { $in: idTrademark },
    });

    const dataR = data.map((i) => {
      return {
        ...i.toObject(),
        trademark: listTrademark.find(
          (value) => value._id.toString() == i.trademarkId
        ),
        favorite: favoriteProductIds.has(i._id.toString())
      };
    });

    // const trademark = await trademarkModel.findById(data.trademarkId)
    res.send(
      dataReturn({
        items: dataR,
        total: record,
      })
    );
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const dataBody = req.body;
    const data = await productModel.create({
      ...dataBody,
      trademarkId: dataBody.trademark,
    });
    res.send(dataReturn(data, "them moi thanh cong"));
  } catch (error) {
    res.send(error);
  }
};

export const detailProductByManage: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findOne({ _id: id });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const trademark = await trademarkModel.findOne({
      _id: product.trademarkId,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cloneProduct: any = { ...product };
    const dataRe = { ...cloneProduct._doc, trademark };
    res.send(dataReturn(dataRe));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const detailProductByShop: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findOne({ _id: id });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    // const view = await ViewModel.findOne({productId: product.id})
    // if (view){
    //   view.quantity = view.quantity + 1
    //   await view.save()
    // }else{
    await ViewModel.create({productId: product.id})
    // }
    // // Tăng số lượt xem lên 1
    // product.view = (product.view || 0) + 1;

    // // Lưu sản phẩm đã cập nhật với số lượt xem mới vào cơ sở dữ liệu
    // await product.save();
    const trademark = await trademarkModel.findOne({
      _id: product.trademarkId,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cloneProduct: any = { ...product };
    const dataRe = { ...cloneProduct._doc, trademark };
    res.send(dataReturn(dataRe));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const dataBody = req.body;
    const data = await productModel.findByIdAndUpdate(id, {
      ...dataBody,
      trademarkId: dataBody.trademark,
    });
    res.send(dataReturn(data));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await productModel.findByIdAndDelete(id);
    res.send(dataReturn(data));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};


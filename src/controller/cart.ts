import { RequestHandler } from "express";
import cartModel from "../model/cart";
import ProductModel from "../model/product";
import { dataReturn, errorReturn, getErrorMessage } from "../ulti/hook";

export const getCart: RequestHandler = async (req, res) => {
  try {
    const userId = res.locals.user._id;

    // Lấy dữ liệu giỏ hàng của người dùng
    const cartItems = await cartModel.find({ userId });

    // Lấy danh sách các ID sản phẩm trong giỏ hàng
    const productIds = cartItems.map((item) => item.productId);

    // Lấy thông tin chi tiết của các sản phẩm trong giỏ hàng
    const productsInCart = await ProductModel.find({
      _id: { $in: productIds },
    });

    // Cập nhật số lượng sản phẩm trong giỏ hàng dựa trên số lượng có sẵn trong kho
    const updatedCartItems = cartItems.map((item) => {
      const product = productsInCart.find((p) => p._id.equals(item.productId));
      if (product) {
        const availableQuantity = product.quantity; // Số lượng sản phẩm có sẵn trong kho
        if (item.quantity > availableQuantity) {
          // Nếu số lượng trong giỏ hàng lớn hơn số lượng có sẵn trong kho
          item.quantity = availableQuantity; // Giảm số lượng trong giỏ hàng để phù hợp
        }
      }
      return item;
    });

    // Lưu trữ lại giỏ hàng đã được cập nhật
    await Promise.all(updatedCartItems.map((item) => item.save()));

    const dataRes = productsInCart.map((product) =>{
      return {
        ...product.toObject(),
        quantity: updatedCartItems.find((j) => j.productId?.equals(product._id)).quantity,
      }
    })

    res.send(dataReturn(dataRes));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};


export const addCart: RequestHandler = async (req, res) => {
  try {
    const { productId , quantity } = req.body;
    const checkTrung = await cartModel.findOne({
      userId: res.locals.user._id,
      productId: productId,
    });
    if (checkTrung) {
      const data = await cartModel.findByIdAndUpdate(checkTrung._id, {
        quantity: checkTrung.quantity + quantity,
      });
      res.send(dataReturn(data, "update thanh cong"));
    } else {
      const data = await cartModel.create({
        productId: productId,
        quantity: quantity,
        userId: res.locals.user._id,
      });
      res.send(dataReturn(data, "them moi thanh cong"));
    }
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const removeCart : RequestHandler = async (req, res) => {
  try {
    const productId = req.params.id
    console.log(productId);
    
    const checkTrung = await cartModel.findOne({
      userId: res.locals.user._id,
      productId: productId,
    });

    if (checkTrung){
      if (checkTrung.quantity <= 1){
        await cartModel.findByIdAndDelete(checkTrung._id)
        res.send(dataReturn(checkTrung, "xoa khoi gio hang"));
      } else{
        const data = await cartModel.findByIdAndUpdate(checkTrung._id, {
          quantity: checkTrung.quantity - 1,
        });
        res.send(dataReturn(data, "giam  1 san pham"));
      }
    }
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
}

export const deleteProductInCart : RequestHandler = async (req, res) => {
  try {
    const productId = req.params.id
    console.log(productId);
    
    const checkTrung = await cartModel.findOne({
      userId: res.locals.user._id,
      productId: productId,
    });

    await cartModel.findByIdAndDelete(checkTrung._id)
        res.send(dataReturn(checkTrung, "xoa khoi gio hang"));

  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
}
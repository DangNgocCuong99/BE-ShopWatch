import CartModel from "../model/cart";
import InvoiceModel from "../model/invoice";
import ProductModel from "../model/product"; // Import ProductModel
import { dataReturn, errorReturn, getErrorMessage } from "../ulti/hook";
import { RequestHandler } from "express";
import { statusInvoice } from "../ulti/types";

export const checkout: RequestHandler = async (req, res) => {
  try {
    const { statusPayment, statusInvoice , transportFee } = req.body;
    // Lấy dữ liệu từ giỏ hàng của người dùng
    const cartItems = await CartModel.find({ userId: res.locals.user._id });
    if (cartItems.length === 0) {
      res.send(errorReturn("Không có sản phẩm nào trong giỏ hàng"));
      return;
    }

    // Tính tổng số tiền cần thanh toán và lấy thông tin chi tiết của sản phẩm từ productId
    let totalAmount = 0;
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const productDetails = await ProductModel.findById(item.productId);
        if (!productDetails) {
          throw new Error(`Product with id ${item.productId} not found`);
        }
        const itemTotal = productDetails.discountedPrice * item.quantity;
        totalAmount += itemTotal;
        return {
          productId: item.productId,
          quantity: item.quantity,
          productDetails: productDetails,
          itemTotal: itemTotal,
        };
      })
    );

    // Tạo danh sách các mục cho hóa đơn
    const invoiceItems = itemsWithDetails.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      productDetails: item.productDetails,
      itemTotal: item.itemTotal,
    }));

    // Tạo hóa đơn
    const newInvoice = await InvoiceModel.create({
      userId: res.locals.user._id,
      items: invoiceItems,
      totalAmount: totalAmount,
      statusPayment: statusPayment,
      statusInvoice: statusInvoice,
      transportFee: transportFee
    });

    // Xóa các mục trong giỏ hàng sau khi thanh toán thành công
    await CartModel.deleteMany({ userId: res.locals.user._id });

    res.send(dataReturn(newInvoice, "Thanh toán thành công"));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const handleGetDetailInvoice: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("🚀 ~ consthandleGetInvoice:RequestHandler= ~ id:", id);
    const invoice = await InvoiceModel.findById(id);
    res.send(dataReturn(invoice));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

export const handleGetInvoice: RequestHandler = async (req, res) => {
  try {
    const invoice = await InvoiceModel.find();
    res.send(dataReturn(invoice));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

const start = new Date("2024-01-01").getTime();
const end = new Date("2024-12-31").getTime();

export const handleGetDashboardInvoice: RequestHandler = async (req, res) => {
  try {
    const result = await InvoiceModel.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          statusInvoice: { $ne: statusInvoice.cancelled },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $group: {
          _id: "$items.productId",
          totalQuantity: { $sum: "$items.quantity" },
          totalAmount: { $sum: { $multiply: ["$items.quantity", { $arrayElemAt: ["$productInfo.discountedPrice", 0] }] } },
          productName: { $first: { $arrayElemAt: ["$productInfo.name", 0] } },
        },
      },
      {
        $project: {
          _id: 1, // Loại bỏ trường _id
          totalQuantity: 1,
          totalAmount: 1,
          productName: 1,
        },
      },
    ]);
    
    let total = 0

    for(const element of result) {
      total += element.totalAmount
    }
    res.send(dataReturn({result,total}));
  } catch (error) {
    res.send(errorReturn(getErrorMessage(error)));
  }
};

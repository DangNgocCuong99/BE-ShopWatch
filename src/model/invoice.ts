import mongoose from "mongoose";
import { statusInvoice, statusPayment } from "../ulti/types";

const invoiceItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  productDetails: {
    type: mongoose.Schema.Types.Mixed,  // Lưu trữ thông tin chi tiết của sản phẩm
    default: {}  // Giá trị mặc định là một object rỗng
  }
});

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [invoiceItemSchema],  // Sử dụng schema riêng cho mỗi mục trong items
  totalAmount: Number,
  statusPayment: { type: String, default: statusPayment.cash },
  statusInvoice: { type: String, default: statusInvoice.cancelled},
  transportFee: Number,
  discount:Number,
  address:String,
  phone:String,
  createdAt: { type: Number, default: Date.now }
});

const InvoiceModel = mongoose.model('Invoice', invoiceSchema);

export default InvoiceModel;

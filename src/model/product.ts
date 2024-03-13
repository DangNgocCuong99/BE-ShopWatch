import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: String,
  originalPrice: Number,
  discountedPrice: Number,
  images: [String],
  createdAt: { type: Number, default: Date.now },
  trademarkId : { type: String ,require:true },
  soHieu: String,
  xuatXu: String,
  gioiTinh:String,
  kinh:String,
  may:String,
  baoHanhQuocTe:String,
  baoHanhTrongNuoc:String,
  duongKinhMatSo:String,
  beDayMatSo:String,
  nieng:String,
  dayDeo:String,  
  mauMatSo:String,
  chongNuoc:String,
  quantity:Number,
  sold:Number,
  view: { type: Number, default: 0 },
});

const ProductModel = mongoose.model('product', productSchema);
export default ProductModel 
import mongoose, { Document, Model } from "mongoose";
import dayjs from "dayjs";

// Định nghĩa interface cho document sản phẩm
export interface IProduct extends Document {
  name: string;
  originalPrice: number;
  discountedPrice: number;
  images: string[];
  createdAt: number;
  trademarkId: string;
  soHieu: string;
  xuatXu: string;
  gioiTinh: string;
  kinh: string;
  may: string;
  baoHanhQuocTe: string;
  baoHanhTrongNuoc: string;
  duongKinhMatSo: string;
  beDayMatSo: string;
  nieng: string;
  dayDeo: string;
  mauMatSo: string;
  chongNuoc: string;
  quantity: number;
  sold: number;
  weight: string;
  isNewProject: boolean; // Trường isNewProject
  isBestSale:boolean;
  isHot:boolean
}

// Định nghĩa schema cho sản phẩm
const productSchema = new mongoose.Schema<IProduct>({
  name: String,
  originalPrice: Number,
  discountedPrice: Number,
  images: [String],
  createdAt: { type: Number, default: Date.now },
  trademarkId: { type: String, required: true },
  soHieu: String,
  xuatXu: String,
  gioiTinh: String,
  kinh: String,
  may: String,
  baoHanhQuocTe: String,
  baoHanhTrongNuoc: String,
  duongKinhMatSo: String,
  beDayMatSo: String,
  nieng: String,
  dayDeo: String,
  mauMatSo: String,
  chongNuoc: String,
  quantity: Number,
  sold: Number,
  weight: String,
  isBestSale: { type: Boolean, default: false },
  isHot: { type: Boolean, default: false }
});

// Thêm trường isNewProject bằng cách sử dụng ứng dụng phương thức virtual của Mongoose
productSchema.virtual("isNewProject").get(function (this: IProduct) {
  const sevenDaysAgo = dayjs().subtract(7, "day").valueOf();
  return dayjs(this.createdAt).isAfter(sevenDaysAgo);
});

// Định nghĩa model cho sản phẩm
const ProductModel: Model<IProduct> = mongoose.model("Product", productSchema);
export default ProductModel;
  
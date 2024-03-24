import mongoose from "mongoose";
const voucherSchema = new mongoose.Schema({
    code:String,
    moTa:String,
    discount:Number,
    createdAt: { type: Number, default: Date.now }
  });

 const VoucherModel = mongoose.model('voucher', voucherSchema);
 export default VoucherModel
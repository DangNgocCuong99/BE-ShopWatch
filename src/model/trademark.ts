import mongoose from "mongoose";


const trademarkSchema = new mongoose.Schema({
  name: String,
  images: [String],
  createdAt: { type: Date, default: Date.now },
  moTa:String
});

const trademarkModel = mongoose.model('trademark', trademarkSchema);
export default trademarkModel 
import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  startTime: Number,
  endTime: Number,
  discountedPrice: Number,
  createdAt: { type: Number, default: Date.now }
});
const CartModel = mongoose.model('cart', cartSchema);
export default CartModel
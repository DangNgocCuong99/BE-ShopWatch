import mongoose from "mongoose";
const viewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    createdAt: { type: Number, default: Date.now },
});

const ViewModel = mongoose.model('view', viewSchema);
export default ViewModel 
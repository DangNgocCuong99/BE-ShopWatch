"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    createdAt: { type: Date, default: Date.now }
});
const CartModel = mongoose_1.default.model('cart', cartSchema);
exports.default = CartModel;
//# sourceMappingURL=cart.js.map
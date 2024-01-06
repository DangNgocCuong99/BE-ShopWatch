"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const favoriteSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product' },
    createdAt: { type: Date, default: Date.now }
});
const FavoriteModel = mongoose_1.default.model('favorite', favoriteSchema);
exports.default = FavoriteModel;
//# sourceMappingURL=favorite.js.map
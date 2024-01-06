"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const trademarkSchema = new mongoose_1.default.Schema({
    name: String,
    images: [String],
    createdAt: { type: Date, default: Date.now },
});
const trademarkModel = mongoose_1.default.model('trademark', trademarkSchema);
exports.default = trademarkModel;
//# sourceMappingURL=trademark.js.map
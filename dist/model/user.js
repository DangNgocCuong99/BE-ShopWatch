"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const types_1 = require("../ulti/types");
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true },
    password: String,
    email: { type: String },
    status: { type: String, default: types_1.accountStatusType.inactive },
    otp: { type: String, default: "" },
    role: { type: String, default: types_1.roleAccountType.user },
    createdAt: { type: Date, default: Date.now }
});
const UserModel = mongoose_1.default.model('user', userSchema);
exports.default = UserModel;
//# sourceMappingURL=user.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vnpay_1 = require("../controller/vnpay");
const routerPayment = express_1.default.Router();
routerPayment.post('/', vnpay_1.createPaymentUrl);
exports.default = routerPayment;
//# sourceMappingURL=payment.js.map
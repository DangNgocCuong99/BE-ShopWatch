"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_1 = require("../controller/cart");
const auth_1 = require("../controller/auth");
const routerCart = express_1.default.Router();
routerCart.use(auth_1.protect);
routerCart.get('/', cart_1.getCart);
routerCart.post('/', cart_1.addCart);
exports.default = routerCart;
//# sourceMappingURL=cart.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = require("../controller/product");
const routerProduct = express_1.default.Router();
routerProduct.get('/', product_1.getMangageProduct);
routerProduct.get('/:id', product_1.detailProduct);
routerProduct.post('/', product_1.createProduct);
exports.default = routerProduct;
//# sourceMappingURL=product.js.map
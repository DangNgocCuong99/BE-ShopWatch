"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trademark_1 = require("../controller/trademark");
const routerTrademark = express_1.default.Router();
routerTrademark.get('/', trademark_1.getTrademark);
routerTrademark.get('/:id', trademark_1.detailTrademark);
routerTrademark.put('/:id', trademark_1.updateTrademark);
routerTrademark.post('/', trademark_1.createTrademark);
routerTrademark.delete('/:id', trademark_1.deleteTrademark);
exports.default = routerTrademark;
//# sourceMappingURL=trademark.js.map
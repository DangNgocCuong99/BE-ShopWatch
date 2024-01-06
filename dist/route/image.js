"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const image_1 = require("../controller/image");
const routerImg = express_1.default.Router();
routerImg.post('/', image_1.uploadImg);
exports.default = routerImg;
//# sourceMappingURL=image.js.map
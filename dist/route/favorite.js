"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const favorite_1 = require("../controller/favorite");
const routerFavorite = express_1.default.Router();
routerFavorite.get('/', auth_1.isLoggedIn, favorite_1.getFavorite);
exports.default = routerFavorite;
//# sourceMappingURL=favorite.js.map
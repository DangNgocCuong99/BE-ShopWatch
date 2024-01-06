"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const auth_1 = require("../controller/auth");
const routerUser = express_1.default.Router();
routerUser.use(auth_1.protect);
routerUser.get('/', (0, auth_1.restrictTo)("admin"), user_1.getUser);
routerUser.get('/:id', user_1.detailUser);
exports.default = routerUser;
//# sourceMappingURL=user.js.map
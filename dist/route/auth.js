"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const routerAuth = express_1.default.Router();
routerAuth.post('/register', auth_1.register);
routerAuth.post('/login', auth_1.login);
routerAuth.post('/otp', auth_1.inputOtp);
exports.default = routerAuth;
//# sourceMappingURL=auth.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailUser = exports.getUser = void 0;
const user_1 = __importDefault(require("../model/user"));
const hook_1 = require("../ulti/hook");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.query.name;
        const email = req.query.email;
        const role = req.query.role;
        const activePage = +req.query.page;
        const limit = +req.query.pageSize;
        const skip = (activePage - 1) * limit;
        const query = {};
        if (name) {
            query.username = { $regex: name, $options: "i" };
        }
        if (email) {
            query.email = { $regex: email, $options: "i" };
        }
        if (role) {
            query.role = role;
        }
        const record = yield user_1.default.find(query).countDocuments();
        const totalPage = Math.ceil(record / limit);
        const data = yield user_1.default.find(query).skip(skip).limit(limit);
        res.send((0, hook_1.dataReturn)({
            items: data,
            total: totalPage,
        }));
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.getUser = getUser;
const detailUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield user_1.default.findOne({ _id: id });
        res.send((0, hook_1.dataReturn)(user));
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.detailUser = detailUser;
//# sourceMappingURL=user.js.map
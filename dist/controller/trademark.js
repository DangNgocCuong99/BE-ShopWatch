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
exports.deleteTrademark = exports.updateTrademark = exports.createTrademark = exports.detailTrademark = exports.getTrademark = void 0;
const trademark_1 = __importDefault(require("../model/trademark"));
const hook_1 = require("../ulti/hook");
const getTrademark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isFetchAll = req.query.isFetchAll;
        if (isFetchAll) {
            const data = yield trademark_1.default.find();
            res.send((0, hook_1.dataReturn)(data));
            return;
        }
        const name = req.query.name || "";
        const activePage = +req.query.page;
        const limit = +req.query.pageSize;
        const skip = (activePage - 1) * limit;
        const record = yield trademark_1.default.countDocuments();
        const totalPage = Math.ceil(record / limit);
        const data = yield trademark_1.default.find({ name: { $regex: name, $options: 'i' } }).skip(skip).limit(limit);
        res.send((0, hook_1.dataReturn)({
            items: data, total: totalPage
        }));
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.getTrademark = getTrademark;
const detailTrademark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const trademark = yield trademark_1.default.findOne({ _id: id });
        res.send((0, hook_1.dataReturn)(trademark));
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.detailTrademark = detailTrademark;
const createTrademark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const trademark = yield trademark_1.default.create(data);
        res.send((0, hook_1.dataReturn)(trademark));
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.createTrademark = createTrademark;
const updateTrademark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const id = req.params.id;
        const trademark = yield trademark_1.default.findByIdAndUpdate(id, data);
        res.send((0, hook_1.dataReturn)(trademark));
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.updateTrademark = updateTrademark;
const deleteTrademark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const trademark = yield trademark_1.default.findByIdAndDelete(id);
        res.send((0, hook_1.dataReturn)(trademark));
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.deleteTrademark = deleteTrademark;
//# sourceMappingURL=trademark.js.map
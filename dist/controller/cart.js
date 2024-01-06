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
exports.addCart = exports.getCart = void 0;
const cart_1 = __importDefault(require("../model/cart"));
const product_1 = __importDefault(require("../model/product"));
const hook_1 = require("../ulti/hook");
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield cart_1.default.find({ userId: res.locals.user._id });
        const listIdProduct = data.map((i) => i.productId);
        const dataProduct = yield product_1.default.find({
            _id: {
                $in: listIdProduct,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cloneArr = [...dataProduct];
        const dataRe = cloneArr.map((i) => {
            return Object.assign(Object.assign({}, i._doc), { quantity: data.find((j) => j.productId.equals(i._id)).quantity });
        });
        res.send((0, hook_1.dataReturn)(dataRe));
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.getCart = getCart;
const addCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        const checkTrung = yield cart_1.default.findOne({
            userId: res.locals.user._id,
            productId: productId,
        });
        if (checkTrung) {
            const data = yield cart_1.default.findByIdAndUpdate(checkTrung._id, {
                quantity: checkTrung.quantity + 1,
            });
            res.send((0, hook_1.dataReturn)(data, "update thanh cong"));
        }
        else {
            const data = yield cart_1.default.create({
                productId: productId,
                quantity: 1,
                userId: res.locals.user._id,
            });
            res.send((0, hook_1.dataReturn)(data, "them moi thanh cong"));
        }
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.addCart = addCart;
//# sourceMappingURL=cart.js.map
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
exports.handleFavorite = exports.getFavorite = void 0;
const favorite_1 = __importDefault(require("../model/favorite"));
const hook_1 = require("../ulti/hook");
const product_1 = __importDefault(require("../model/product"));
const getFavorite = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield favorite_1.default.find({ userId: res.locals.user._id });
        const listIdProduct = data.map((i) => i.productId);
        const dataProduct = yield product_1.default.find({
            _id: {
                $in: listIdProduct,
            },
        });
        res.send((0, hook_1.dataReturn)(dataProduct));
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.getFavorite = getFavorite;
const handleFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.body;
        const checkTrung = yield favorite_1.default.findOne({ userId: userId, productId: productId });
        if (checkTrung) {
            const data = yield favorite_1.default.findByIdAndDelete(checkTrung._id);
            res.send((0, hook_1.dataReturn)(data, "huy yeu thich thanh cong"));
        }
        else {
            const data = yield favorite_1.default.create({ userId: userId, productId: productId });
            res.send((0, hook_1.dataReturn)(data, "them yeu thich thanh cong"));
        }
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.handleFavorite = handleFavorite;
//# sourceMappingURL=favorite.js.map
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
exports.detailProduct = exports.createProduct = exports.getMangageProduct = void 0;
const product_1 = __importDefault(require("../model/product"));
const hook_1 = require("../ulti/hook");
const trademark_1 = __importDefault(require("../model/trademark"));
// import FavoriteModel from "../model/favorite"
const getMangageProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId =123
        const name = req.query.name || "";
        const activePage = +req.query.page;
        const limit = +req.query.pageSize;
        const skip = (activePage - 1) * limit;
        const record = yield product_1.default.countDocuments();
        const totalPage = Math.ceil(record / limit);
        const data = yield product_1.default.find({ name: { $regex: name, $options: 'i' } }).skip(skip).limit(limit);
        // console.log("🚀 ~ file: product.ts:20 ~ constgetMangageProduct:RequestHandler= ~ data:", data)
        // const listIdFavoriteProduct = (await FavoriteModel.find({userId: userId})).map((i)=> i.productId)
        // data.map((i)=>(
        //     {
        //         ...data,
        //         favorite: listIdFavoriteProduct.includes(i._id)
        //     }\
        // ))
        const idTrademark = data.map((i) => (i.trademarkId));
        const listTrademark = yield trademark_1.default.find({ '_id': { $in: idTrademark } });
        const dataR = data.map((i) => {
            return {
                _id: i._id,
                name: i.name,
                discountedPrice: i.discountedPrice,
                originalPrice: i.originalPrice,
                images: i.images,
                trademark: listTrademark.find((value) => value._id.toString() == i.trademarkId)
            };
        });
        // const trademark = await trademarkModel.findById(data.trademarkId)
        res.send((0, hook_1.dataReturn)({
            items: dataR, total: totalPage
        }));
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.getMangageProduct = getMangageProduct;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataBody = req.body;
        const data = yield product_1.default.create(Object.assign(Object.assign({}, dataBody), { trademarkId: dataBody.trademark }));
        res.send((0, hook_1.dataReturn)(data, 'them moi thanh cong'));
    }
    catch (error) {
        res.send(error);
    }
});
exports.createProduct = createProduct;
const detailProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const product = yield product_1.default.findOne({ _id: id });
        const trademark = yield trademark_1.default.findOne({ _id: product.trademarkId });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cloneProduct = Object.assign({}, product);
        const dataRe = Object.assign(Object.assign({}, cloneProduct._doc), { trademark });
        res.send((0, hook_1.dataReturn)(dataRe));
    }
    catch (error) {
        res.send((0, hook_1.errorReturn)((0, hook_1.getErrorMessage)(error)));
    }
});
exports.detailProduct = detailProduct;
//# sourceMappingURL=product.js.map
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./route/user"));
const auth_1 = __importDefault(require("./route/auth"));
const payment_1 = __importDefault(require("./route/payment"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const image_1 = __importDefault(require("./route/image"));
const product_1 = __importDefault(require("./route/product"));
const trademark_1 = __importDefault(require("./route/trademark"));
const cart_1 = __importDefault(require("./route/cart"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'media'); // thu muc luu anh
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage }).any();
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
dotenv_1.default.config();
const { DATABASE_USERNAME, DATABASE_LOCAL, LOCALHOST, DATABASE_PASSWORD, DATABASE, MODE } = process.env;
const app = (0, express_1.default)();
const port = process.env.PORT || 3008;
const DB = MODE === "online" ? DATABASE.replace("<password>", DATABASE_PASSWORD).replace("<username>", DATABASE_USERNAME) : DATABASE_LOCAL.replace("localhost", LOCALHOST);
app.use((0, cors_1.default)({}));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(upload);
app.use(express_1.default.static('media'));
app.use('/user', user_1.default);
app.use('/auth', auth_1.default);
app.use('/payment', payment_1.default);
app.use("/images", image_1.default);
app.use('/product', product_1.default);
app.use('/trademark', trademark_1.default);
app.use('/cart', cart_1.default);
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + " not found" });
});
app.listen(port);
console.log("Server started on: " + port);
mongoose_1.default.Promise = global.Promise;
const Connection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`modeMongoDb: ${process.env.mode}`);
        console.log(` Database Connected : ${DB}`);
    }
    catch (error) {
        console.log(error);
    }
});
Connection();
//# sourceMappingURL=app.js.map
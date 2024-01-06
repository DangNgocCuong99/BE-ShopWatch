import express from "express"
import {  getCart,addCart} from "../controller/cart"
import { protect } from "../controller/auth"
const routerCart = express.Router()
routerCart.use(protect)

routerCart.get('/', getCart )
routerCart.post('/', addCart )

export default routerCart
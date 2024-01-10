import express from "express"
import {  getCart,addCart, removeCart} from "../controller/cart"
import { protect } from "../controller/auth"
const routerCart = express.Router()
routerCart.use(protect)

routerCart.get('/', getCart )
routerCart.post('/', addCart )
routerCart.delete('/:id',removeCart)

export default routerCart
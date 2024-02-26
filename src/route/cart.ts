import express from "express"
import {  getCart,addCart, removeCart, deleteProductInCart} from "../controller/cart"
import { protect } from "../controller/auth"
const routerCart = express.Router()
routerCart.use(protect)

routerCart.get('/', getCart )
routerCart.post('/', addCart )
routerCart.delete('/delete-one/:id',removeCart)
routerCart.delete('/delete-all/:id',deleteProductInCart)

export default routerCart
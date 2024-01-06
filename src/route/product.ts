import express from "express"
import { createProduct,getMangageProduct,detailProduct } from "../controller/product"
const routerProduct = express.Router()
routerProduct.get('/', getMangageProduct )
routerProduct.get('/:id', detailProduct )
routerProduct.post('/', createProduct )

export default routerProduct
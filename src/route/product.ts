import express from "express"
import { createProduct,getMangageProduct,detailProduct, updateProduct, deleteProduct } from "../controller/product"
const routerProduct = express.Router()
routerProduct.get('/', getMangageProduct )
routerProduct.get('/:id', detailProduct )
routerProduct.post('/', createProduct )
routerProduct.put('/:id', updateProduct)
routerProduct.delete('/:id', deleteProduct)

export default routerProduct
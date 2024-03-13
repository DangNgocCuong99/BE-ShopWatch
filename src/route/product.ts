import express from "express"
import { createProduct,getMangageProduct, updateProduct, deleteProduct, detailProductByManage, detailProductByShop } from "../controller/product"
const routerProduct = express.Router()
routerProduct.get('/', getMangageProduct )
routerProduct.get('/manage/:id', detailProductByManage )
routerProduct.get('/shop/:id', detailProductByShop )
routerProduct.post('/', createProduct )
routerProduct.put('/:id', updateProduct)
routerProduct.delete('/:id', deleteProduct)

export default routerProduct
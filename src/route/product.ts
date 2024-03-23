import express from "express"
import { createProduct,getMangageProduct, updateProduct, deleteProduct, detailProductByManage, detailProductByShop } from "../controller/product"
import { protect } from "../controller/auth";
const routerProduct = express.Router()
routerProduct.use(protect);
routerProduct.get('/', getMangageProduct )
routerProduct.get('/manage/:id', detailProductByManage )
routerProduct.get('/shop/:id', detailProductByShop )
routerProduct.post('/', createProduct )
routerProduct.put('/:id', updateProduct)
routerProduct.delete('/:id', deleteProduct)

export default routerProduct
import express from "express"
import { createTrademark,deleteTrademark,getTrademark ,detailTrademark, updateTrademark, } from "../controller/trademark"
const routerTrademark = express.Router()
routerTrademark.get('/', getTrademark )
routerTrademark.get('/:id',detailTrademark)
routerTrademark.put('/:id',updateTrademark)  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    routerTrademark.post('/', createTrademark )
routerTrademark.delete('/:id', deleteTrademark)

export default routerTrademark
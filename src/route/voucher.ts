import express from "express"
import { protect } from "../controller/auth"
import { checkVoucher, createVoucher, deleteVoucher, detailVoucher, getVoucher, updateVoucher } from "../controller/voucher"
const routerVoucher = express.Router()
routerVoucher.use(protect)
routerVoucher.get('/check/:code',checkVoucher)
routerVoucher.get('/', getVoucher )
routerVoucher.get('/:id', detailVoucher )
routerVoucher.post('/', createVoucher)
routerVoucher.put('/:id', updateVoucher)
routerVoucher.delete('/:id', deleteVoucher)

export default routerVoucher
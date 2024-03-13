import express from "express"
import { checkout, handleGetDashboardInvoice, handleGetDetailInvoice, handleGetInvoice } from "../controller/invoice"
import { protect } from "../controller/auth"
const routerInvoice = express.Router()

routerInvoice.get('/dashboard',handleGetDashboardInvoice)
routerInvoice.use(protect)

routerInvoice.post('/', checkout )
routerInvoice.get('/:id', handleGetDetailInvoice)
routerInvoice.get('/',handleGetInvoice)

export default routerInvoice
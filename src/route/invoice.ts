import express from "express";
import {
  checkout,
  getDashboardChart,
  handleDeleteInvoice,
  handleGetDashboardInvoice,
  handleGetDetailInvoice,
  handleGetInvoice,
  handleUpdateInvoice,
} from "../controller/invoice";
import { protect } from "../controller/auth";
const routerInvoice = express.Router();

routerInvoice.get("/dashboard", handleGetDashboardInvoice);
routerInvoice.get("/chart", getDashboardChart);
routerInvoice.use(protect);

routerInvoice.post("/", checkout);
routerInvoice.get("/:id", handleGetDetailInvoice);
routerInvoice.get("/", handleGetInvoice);
routerInvoice.put("/:id", handleUpdateInvoice);
routerInvoice.delete("/:id", handleDeleteInvoice);

export default routerInvoice;

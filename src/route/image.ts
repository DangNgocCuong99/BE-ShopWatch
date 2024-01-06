import express from "express"
import { uploadImg } from "../controller/image"
const routerImg = express.Router()
routerImg.post('/', uploadImg )
export default routerImg
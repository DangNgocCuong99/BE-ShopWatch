import express from "express"
import { changeActiveUser, detailUser, getUser, getCurrentUser, updateCurrentUser } from "../controller/user"
import { protect, restrictTo } from "../controller/auth"
const routerUser = express.Router()
routerUser.use(protect)
routerUser.get("/current",getCurrentUser)
routerUser.put('/current', updateCurrentUser )
routerUser.get('/',restrictTo("admin"), getUser )
routerUser.get('/:id', detailUser )
routerUser.patch('/:id', changeActiveUser )

export default routerUser
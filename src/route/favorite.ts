import express from "express"
import { getFavorite, handleFavorite } from "../controller/favorite"
import { protect } from "../controller/auth"
const routerFavorite = express.Router()
routerFavorite.use(protect)
routerFavorite.get('/', getFavorite )
routerFavorite.post('/', handleFavorite)

export default routerFavorite
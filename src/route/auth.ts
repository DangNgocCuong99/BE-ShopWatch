import express from "express"
import { handleRefreshToken, inputOtp, login, register } from "../controller/auth"
const routerAuth = express.Router()
routerAuth.post('/register', register)
routerAuth.post('/login', login )
routerAuth.post('/otp',inputOtp)
routerAuth.post('/refreshToken',handleRefreshToken)

export default routerAuth
import express from "express";
import {verifyToken} from "../middlewares/verifyToken"
import {login,forgetPassword} from "../auth/auth.js"
const AuthRouter = express.Router()



AuthRouter.post('/login', login)
AuthRouter.post('/forget-password', forgetPassword)







module.exports = AuthRouter
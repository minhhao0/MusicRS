import express from "express"
import { login_method, signup_method } from "../controllers/UserController.js"
const userRouter=express.Router()
userRouter.post('/login',login_method)
userRouter.post('/signup',signup_method)
export {
    userRouter
}
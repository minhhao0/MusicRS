import express from "express"
<<<<<<< HEAD
import { add_favorite_album, add_favorite_artist, add_favorite_track, get_user_favorite, get_user_history, login_method, signup_method } from "../controllers/UserController.js"
const userRouter=express.Router()
userRouter.post('/login',login_method);
userRouter.post('/signup',signup_method);
userRouter.post('/history',get_user_history);
userRouter.post('/favorite',get_user_favorite);
userRouter.post('/favorite/artist',add_favorite_artist);
userRouter.post('/favorite/track',add_favorite_track);
userRouter.post('/favorite/album',add_favorite_album);
=======
import { login_method, signup_method } from "../controllers/UserController.js"
const userRouter=express.Router()
userRouter.post('/login',login_method)
userRouter.post('/signup',signup_method)
>>>>>>> dat
export {
    userRouter
}
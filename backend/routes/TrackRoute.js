
import express from "express"
import {track_home_recommend_method,track_home_trend_method, get_genre_method, get_limit_genre_method} from "../controllers/TrackController.js"
const trackRouter=express.Router()
trackRouter.get('/genre',get_genre_method)
trackRouter.get('/genrelimit',get_limit_genre_method)
trackRouter.get('/track-home-trend/:limit',track_home_trend_method)
trackRouter.get('/track-home-recommned:limit',track_home_recommend_method)
export {
    trackRouter
}

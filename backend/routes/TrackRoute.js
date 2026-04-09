
import express from "express"
import {get_genre_method, track_home_recommend_method,track_home_trend_method} from "../controllers/TrackController.js"
const trackRouter=express.Router()
trackRouter.get('/genre',get_genre_method)
trackRouter.get('/track-home-trend',track_home_trend_method)
trackRouter.get('/track-home-recommned',track_home_recommend_method)
export {
    trackRouter
}

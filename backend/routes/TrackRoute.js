import express from "express"
import {track_home_recommend_method,track_home_trend_method} from "../controllers/TrackController.js"
const trackRouter=express.Router()
trackRouter.get('/track-home-trend',track_home_trend_method)
trackRouter.get('/track-home-recommned',track_home_recommend_method)
export {
    trackRouter
}
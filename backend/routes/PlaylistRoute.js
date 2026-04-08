import express from "express"
import {getPlaylistHome_method} from "../controllers/PlaylistController.js"
const playlistRouter=express.Router()
playlistRouter.get('/playlist-home',getPlaylistHome_method)
// artistRouter.get('/track-home-recommned',track_home_recommend_method)
export {
    playlistRouter
}
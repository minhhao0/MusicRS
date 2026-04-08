import express from 'express'
import { getTotalGenre } from '../services/TrackService.js'
const trackRouter=express.Router()
trackRouter.post('/genre',getTotalGenre)
export{
    trackRouter
}

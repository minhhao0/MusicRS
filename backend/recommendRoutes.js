/**
 * backend/recommendRoutes.js
 */

const express = require('express');
const router  = express.Router();
const { getHomeRecommendations, getAlbumRecommendations } = require('./recommendController');

// GET  /api/recommend/home
router.get('/home', getHomeRecommendations);

// POST /api/recommend/albums
router.post('/albums', getAlbumRecommendations);

module.exports = router;
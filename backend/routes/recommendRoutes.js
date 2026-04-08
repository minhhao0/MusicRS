import {express} from 'express'
import { getHomeRecommendations,getAlbumRecommendations } from '../controllers/recommendController.js';
const recommedRouter  = express.Router();
router.get('/home', getHomeRecommendations);
router.post('/albums', getAlbumRecommendations);

export { recommedRouter};
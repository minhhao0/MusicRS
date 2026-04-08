import {getTotalTrack,getTrack,getTrackHomeRecommend,getTrackHomeTrend} from "../services/TrackService.js";

const track_home_trend_method = async (req, res) => {
    try{
       const data=req.body;
       console.log(data);
       const trackHomeTrend = await getTrackHomeTrend();
       if (trackHomeTrend){
        res.status(200).send(trackHomeTrend);
        console.log(trackHomeTrend)
       }
    }
    catch(err){
        res.status(501).send('Server error')
    }
};

const track_home_recommend_method = async (res) => {
    try{
       const data=req.body;
       console.log(data);
       const trackHomeRecommend = await getTrackHomeRecommend();
       if (trackHomeRecommend){
        res.status(200).send(trackHomeRecommend);
       }
    }
    catch(err){
        res.status(501).send('Server error')
    }
};


export {
    track_home_trend_method, track_home_recommend_method
}
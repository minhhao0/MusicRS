import {getTotalTrack,getTrack,getTrackHomeRecommend,getTrackHomeTrend,getTotalGenre} from "../services/TrackService.js";


const get_genre_method= async(req,res)=>{
    try{
       const genre= await getTotalGenre();
       if(!genre){
        res.status(200).send(genre)
       } else{
        res.status(404).send("Not Found !");
       }
    } catch(err){
        res.status(501).send("Server Error");
    }
    
}
const track_home_trend_method = async (req, res) => {
    try{
       const data=req.body;
       console.log(data);
       const trackHomeTrend = await getTrackHomeTrend();
       if (trackHomeTrend){
        res.status(200).send(trackHomeTrend);
        // console.log(trackHomeTrend)
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
    track_home_trend_method, track_home_recommend_method,get_genre_method
}
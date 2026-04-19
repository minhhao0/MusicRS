import {getTotalTrack,getTrack,getTrackHomeRecommend,getTrackHomeTrend, getTotalGenre, getGenre} from "../services/TrackService.js";

const get_genre_method= async(req,res)=>{
    try{
       const genre= await getTotalGenre();
       if(genre){
        res.status(200).send(genre)
       } else{
        res.status(404).send("Not Found !");
       }
    } catch(err){
        res.status(501).send("Server Error");
    }
}
const get_limit_genre_method= async(req,res)=>{
    try{
       const genre= await getGenre();
       if(genre){
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
       const data=req.params;
       console.log(data.limit);
       const trackHomeTrend = await getTrackHomeTrend(data.limit);
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
       const data=req.params;
       console.log(data);
       const trackHomeRecommend = await getTrackHomeRecommend(data.limit);
       if (trackHomeRecommend){
        res.status(200).send(trackHomeRecommend);
       }
    }
    catch(err){
        res.status(501).send('Server error')
    }
};
export {
    track_home_trend_method, track_home_recommend_method, get_genre_method, get_limit_genre_method
}
import { getTotalGenre } from "../services/TrackService.js"

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
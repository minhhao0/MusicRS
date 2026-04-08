import {getPlaylistHome} from "../services/PlaylistService.js";

const getPlaylistHome_method = async (req, res) => {
    try{
       const data=req.body;
       console.log(data);
       const content = await getPlaylistHome();
       if (content){
        res.status(200).send(content);
        // console.log(artistHomeTrend)
       }
    }
    catch(err){
        res.status(501).send('Server error')
    }
};

export {
    getPlaylistHome_method
}
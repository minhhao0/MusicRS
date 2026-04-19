import { getTotalUser,getUser,createUser,updateUser, getUserHistory, getUserFavorite, addFavoriteArtist, addFavoriteTrack, addFavoriteAlbum, updateUserHistory } from "../services/UserService.js";

const login_method = async (req,res) => {
    try{
       
       const data=req.body;
       console.log(data);
       const user= await getUser(data);
       if (user){
        res.status(200).send(user);
       } else
       {
        res.status(400).send("Not Found.")
       }
    }
    catch(err){
        res.status(501).send('Server error')
    }
};
const signup_method= async (req,res)=>{
    try{
        const data=req.body;
        const user=await createUser(data);
        if(user){
            res.status(200).send("Create account successfully.");
        }
    } catch(err){
        res.status(400).send("An error occur. Please try again.")
    }
}
const get_user_history= async (req,res)=>{
    try{
        const data=req.body;
        const history= await getUserHistory(data);
        if(history){
            res.status(200).send(history);
        } else{
            res.status(404).send('Not Found!');
        }
    } catch(err){
        res.status(501).send('Server Error.');
    }
}
const get_user_favorite=async (req,res)=>{
    try{
        const data=req.body;
        const user_favorite=await getUserFavorite(data);
        if(user_favorite){
            res.status(200).send(user_favorite);
        } else{
            res.status(404).send('Not Found!');
        }
    }catch(err){
            res.status(501).send('Server Error.');
        }
}
const add_favorite_artist=async (req,res)=>{
    try{
        const data=req.body;
        const result=await addFavoriteArtist(data);
        if(result){
            res.status(200).send("add favorite artist successfully.");
        } else{
            res.status(400).send("An error occur");
        }
    } catch(err){
        res.status(501).send("Server Error.");
    }
}
const add_favorite_track=async (req,res)=>{
    try{
        const data=req.body;
        const result=await addFavoriteTrack(data);
        if(result){
            res.status(200).send("add favorite track successfully.");
        } else{
            res.status(400).send("An error occur");
        }
    } catch(err){
        res.status(501).send("Server Error.");
    }
}
const add_favorite_album=async (req,res)=>{
    try{
        const data=req.body;
        const result=await addFavoriteAlbum(data);
        if(result){
            res.status(200).send("add favorite artist successfully.");
        } else{
            res.status(400).send("An error occur");
        }
    } catch(err){
        res.status(501).send("Server Error.");
    }
}

const update_user_method = async (req, res)=>{
        try{
        const data=req.body;
        const result=await updateUser(data);
        if(result){
            res.status(200).send("update user successfully.");
        } else{
            res.status(400).send("An error occur");
        }
    } catch(err){
        res.status(501).send("Server Error.");
    }
}
const update_user_history_method=async (req,res)=>{
    try{
        const data=req.body;
        const result=await updateUserHistory(data);
        if(result){
            res.status(200).send("update user history successfully.");
        } else{
            res.status(400).send("An error occur")
        }
    } catch(err){
        res.status(501).send("Server Error.");
    }
}
export {
    login_method,signup_method,
    get_user_history,get_user_favorite,
    add_favorite_album,add_favorite_artist,
    add_favorite_track, update_user_method,update_user_history_method
}
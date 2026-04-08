import { connection } from "../config/db.js";
const getPlayListByUserId=async (data)=>{
    const {user_id}=data;
    const query=`SELECT * from playlist,user,user_playlist where `
}
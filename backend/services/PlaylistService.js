import { connection, mysql } from "../config/db.js";

const getPlaylistHome = async() =>{
    const query = `select * from playlist
limit 5;`
    const result = await connection.getConnection().then((conn)=>{
        const res = conn.query(query)
        conn.release()
        return res
    }).catch((err)=>{
        console.log("error when connect to mysql")
    })
    return result[0]
}

export{
    getPlaylistHome
}
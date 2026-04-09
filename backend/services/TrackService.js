import {connection,mysql} from '../config/db.js'
const getTotalTrack = async()=>{
    const query=`
    SELECT count(*) as total from track 
    `
    const result = await connection.getConnection()
  .then((conn) => {
    const res = conn.query(query);
    conn.release();
    return res;
   })
  .catch((err) => {
    console.log("An error occur when connect to mysql server "+ err);
  });
  return result
}

const getTrack= async()=>
{
  const query=`SELECT * FROM artist`
  const result= await connection.getConnection()
  .then((conn)=>{
    const res=conn.query(query);
    conn.release();
    return res;
  })
  .catch((err)=>{
    console.log("An error occur when connect to mysql server")
  })
  return result
}

const getTrackHomeTrend = async() =>{
  const query=`
 SELECT 
    t.trackid, t.track_name, t.image, t.popularity, 
    GROUP_CONCAT(DISTINCT a.artist_name ORDER BY a.artist_name SEPARATOR ', ') AS artist
FROM track AS t
INNER JOIN artisttrack AS a_t ON t.trackid = a_t.trackid
INNER JOIN artist AS a ON a_t.artistid = a.artistid
GROUP BY 
    t.trackid
ORDER BY t.popularity DESC
LIMIT 5;`
  const result= await connection.getConnection()
  .then((conn)=>{
    const res=conn.query(query);
    conn.release();
    // console.log(res)
    return res;
  })
  .catch((err)=>{
    console.log("An error occur when connect to mysql server")
  })
  // console.log(result)
  return result[0]
}

const getTrackHomeRecommend = async() =>{
  const query=`
  SELECT 
    t.trackid, t.track_name, t.image, t.popularity, 
    GROUP_CONCAT(DISTINCT a.artist_name ORDER BY a.artist_name SEPARATOR ', ') AS artist
FROM track AS t
INNER JOIN artisttrack AS a_t ON t.trackid = a_t.trackid
INNER JOIN artist AS a ON a_t.artistid = a.artistid
GROUP BY 
    t.trackid
ORDER BY t.popularity DESC
LIMIT 5;`
  const result= await connection.getConnection()
  .then((conn)=>{
    const res=conn.query(query);
    conn.release();
    return res;
  })
  .catch((err)=>{
    console.log("An error occur when connect to mysql server")
  })
  return result[0]
}
const getTotalGenre = async() =>{
  const query=`select distinct(genre) as genre from track order by genre asc`
  const result= await connection.getConnection()
  .then((conn)=>{
    const res=conn.query(query);
    conn.release();
    return res;
  })
  .catch((err)=>{
    console.log("An error occur when connect to mysql server")
  })
  return result[0]
}
// const result =await getTrackHomeTrend()
// console.log(result)

export {
  getTotalTrack,getTrack, getTrackHomeTrend, getTrackHomeRecommend,getTotalGenre
}

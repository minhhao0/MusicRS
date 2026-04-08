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
  const query=`SELECT * FROM track`
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
const getTotalGenre = async()=>{
  const query =`select distinct genre from track order by genre asc`
  const result=await connection.getConnection().then((conn)=>{
    const res=conn.query(query);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("An error occur when connect to mysql server")
  })
  return result[0];
}
export {
  getTotalTrack,getTrack,getTotalGenre
}
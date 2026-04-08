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
}

export {
  getTotalTrack,getTrack
}
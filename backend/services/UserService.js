import { User } from "../models/User.js";
import {connection,mysql} from '../config/db.js'
const getTotalUser = async()=>{
    const query=`
    SELECT count(*) as total from user
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
const getUser =async (data)=>{
    const {email,password}=data;
    const query=`SELECT * from user where email = ? and password= ?`
    const result= await connection.getConnection().then((conn)=>{
        const res=conn.query(query,[email,password]);
        conn.release();
        return res;
    }).catch((err)=>{
      console.log("An error occur when connect to mysql server"+ err);
    })
    const tmp=result[0][0];
    const user= new User(tmp['userid'],tmp['username'],tmp['email'],tmp['password']);
    return user;
}
const createUser= async (data)=>{
  console.log(data);
  const {user_name,email,password} =data;
  const query=`INSERT INTO USER(username,password,email) values(?,?,?)`
  const result= await connection.getConnection().then((conn)=>{const res=conn.query(query,[user_name,password,email]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("Can't create new user. Please check again")
  })
  return result
}
const updateUser= async (data)=>{
  const {user_id,user_name,user_password,favorite_genre}=data;
  const query= `UPDATE User set username = ?, password = ?, favorite_genre ?
                WHERE userid= ?`
  const result= await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[user_name,user_password,favorite_genre,user_id]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("Can't update user. Please check again");
  })
  return result;
}
// const data={
//     'user_name':'hao',
//     'password':'234'

// }
// const result=await getUser(data)
// console.log(result)
export {
  getTotalUser,getUser,updateUser,createUser
}
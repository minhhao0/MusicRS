import { getTotalUser,getUser,createUser,updateUser } from "../services/UserService.js";

const login_method = async (req,res) => {
    try{
       
       const data=req.body;
       console.log(data);
       const user= await getUser(data);
       if (user){
        res.status(200).send(user);
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

export {
    login_method,signup_method
}
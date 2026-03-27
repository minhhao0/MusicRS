const app=require('./app')
const path=require('path')
require('dotenv').config({path: path.resolve(__dirname,'../.env')})
const PORT=process.env.port

app.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log(`Server is running on port ${PORT}`);
    }
})
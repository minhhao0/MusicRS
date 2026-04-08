const express = require('express');
const cors=require('cors');
const recommendRoutes = require('./recommendRoutes');
const app=express();
app.use(cors());
app.use(express.json());
app.use('/api/recommend', recommendRoutes);
module.exports=app;
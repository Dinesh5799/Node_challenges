const mongoose = require('mongoose');
const url = "mongodb+srv://bruce_wayne:Batman%40123@playmongo-iaepa.mongodb.net/contactManager";

mongoose.connect(url,{useNewUrlParser:true},(err)=>{
    if(!err){
        console.log("Successfully connected to db.");
    }else{
        console.log("Error connecting to db.");
    }
});

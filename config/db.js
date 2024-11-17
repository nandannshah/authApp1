const mongoose = require('mongoose');

require("dotenv").config();

exports.dbConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL,{})
    .then(()=>{
        console.log("Database connection successful");
    })
    .catch((err)=>{
        console.log("DB connection issue");
        console.error(err);
        process.exit(1);
    })
}


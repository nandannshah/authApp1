const express = require('express');
const app = express();

require('dotenv').config;

const PORT = process.env.PORT || 4000;

app.use(express.json());

require('./config/db').dbConnect();

//Routes create

const user = require('./Routes/user');

app.use('/api/v1', user);

//Activate server

app.listen(PORT, ()=>{
    console.log(`Server succesfully started at ${PORT}`);
})
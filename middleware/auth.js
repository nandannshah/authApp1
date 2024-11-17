//auth , isStudent , isAdmin

const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req,res, next) =>{
    try{

        //Extract jwt there are three ways
        const token = req.body.token || req.cookie.token ;
        

        if(!token){
            return res.status(401).json({
                success: false,
                message:"Token not fetched"
            })
        }

        //Verify the token
        try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode);

        req.user = decode;
        }catch(err){
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();

    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:'Error while fetching token'
        })
    }
}

exports.isStudent = (req,res, next) =>{
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:'This is protected route for student',
            })
        }
        next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message:'User role not matching',
        })
    }
}

exports.isAdmin = (res, req, next) =>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(200).json({
                success:true,
                message:'This is protected Route of Admin'
            })
        }
    }catch(err){
        return res.status(401).json({
            success:false,
            message:'Ther is error hitting in Admin Route',
        })
    }
}
const express = require('express');
const router = express.Router();

const{login, signUp} = require("../controller/Auth");
const {auth, isStudent, isAdmin} = require('../middleware/auth');


router.post('/login', login);
router.post('/signup', signUp);


router.post('/test', auth, (req, res) => {
    res.json({
        success:true,
        message:"welcome to the protected route of test",
    })
});

router.get("/student", auth, isStudent, (req,res) =>{
    res.json({
        success:true,
        message:"Welcome to the Protected route of Student",
    })
});

router.get('/admin',auth, isAdmin, (req, res) =>{
    res.json({
        success:true,
        message:"Welcome to the Protected route of Admin",
    })
});


module.exports = router;
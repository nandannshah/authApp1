const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signUp = async (req, res) => {
  try {
    //get data
    const { name, email, password, role } = req.body;
    //check if email already exists
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    //Secure Password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Password not hashed",
      });
    }

    //Create entry in db
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "Entry created successfully",
    });
  } catch (err) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be created, Please try again later",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation for email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the detail correctly",
      });
    }
    //Check for registered user
    let user = await User.findOne({ email });

    //if not Registered
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "USer not registered",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    //Password matching
    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user = user.toObject(); //convert user to plain js object so that it can reflect changes after successful retrieval as
      //mongoose document
      user.token = token;

      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User logged in successfully",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Login Failure",
      details: err.message,
    });
  }
};

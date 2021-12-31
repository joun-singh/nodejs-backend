const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const {login, signup, signout} = require('../controllers/auth');

router.post("/signup",[
    check("name").isLength({min:3}).withMessage("Name should be of minimum 3 character"),
    check("email").isEmail().withMessage("Email is Invaid"),
    check("password").isLength({min:3}).withMessage("Password should be of 3 char")
],signup)

router.post('/login',[
    check("email").isEmail().withMessage("Email is required"),
    check("password").isLength({min:1}).withMessage("Password is required")
] ,login)

router.get("/signout", signout)


module.exports= router
const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs') // For Password hashing
const jwt = require('jsonwebtoken') // For secure authentication for login
const fetchuser =require('../middlewares/fetchuser')

const JWT_SECRET_KEY = process.env.SECRET_KEY_JWT // SECRET KEY for JWT authentication - To be stored in a safe file 

// Route1 : Create a user using POST request  to 'api/auth/createuser' endpoint: No login required
router.post('/createuser',[
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password must be atleast 5 characters long").isLength({ min: 5 }),

], async (req,res)=>{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({success, error: String(errors.array()) });
    }
    try{
    // Check whether the user with same email already exists
    let user = await User.findOne({email: req.body.email})
    if(user)
    {
        return res.status(400).json({success, error: `This email(${req.body.email}) already exists`})
    }

    const salt = await bcrypt.genSalt(10) // To generate a salt
    const securePass = await bcrypt.hash(req.body.password, salt) // It returns a promise - so await
    // Creating requested user and adding to database
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass
    })

    const data = {
        user:{
            id: user.id
        }
    }
    const authToken = jwt.sign(data, JWT_SECRET_KEY) // It returns a token with three parts separated by two dots 
    success = true;
    res.json({success, authToken})
    // res.json(user)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Internal Server error")
    }
})


// Route2 : For authenticating a User : Login not required

router.post('/login',[
    // While login we'll send just the email first for authentication - If email is correct then we'll proceed to next
    body('email', "Enter a valid email").isEmail(), // To check if the email is of correct format
    body('password', 'Password cannot be blank').exists() // To check if the email is not blank
], async (req, res)=>{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success, error: "Credentials are not correct. Try again"})
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare)
        {
            return res.status(400).json({success, error: "Credentials are not correct. Try again"})
        }

        // If password is correct then we'll send the user's id i.e. we'll authenticate the user successfully for login
        const data = {
            user:{
                id: user.id
            }
        }
        const username = user.name;
        const authToken = jwt.sign(data, JWT_SECRET_KEY)
        success = true;
        res.json({success, authToken, username, email})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error")
    }
})

// Route3 : For getting User details of logged in user : Login required

router.post('/getuser', fetchuser, async (req, res)=>{
    try {
        const userId = req.user.id // See middleware(fetchuser) code
        const userData = await User.findById(userId).select('-password')
        res.json(userData)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error")
    }
})

module.exports =router
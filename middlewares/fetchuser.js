// This middleware we're creating to get the user. This is for making the application scalable(for future)
// Now we are calling this middleware in auth.js for getting User details when log in is required. So in future for all the routes
//  wherever same thing we have to do we can use this middleware to get the logged in user details

const jwt = require('jsonwebtoken')

const JWT_SECRET_KEY = process.env.SECRET_KEY_JWT; 

const fetchuser = (req,res,next)=>{
    // Get the user from the jwt token and add user id to the req object
    const token = req.header('auth-token') // So while sending the request we'll send the header with the name 'auth-token' which is passed here as parameter

    if(!token){
        return res.status(401).send({error: "Authenticate using correct token"})
    }
    try {
        const data =jwt.verify(token, JWT_SECRET_KEY)
        req.user = data.user
        next(); // So that the next middleware gets called
    } catch (error) {
        res.status(401).send({error: "Authenticate using correct token"})
    }
    

    
}
module.exports = fetchuser;
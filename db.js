require("dotenv").config()

const mongoose = require('mongoose')

// MongoDB Atlas connection URI
const mongoURI = process.env.CONNECTION_URI
// localhost mongod URI
// const mongoURI = 'mongodb://localhost:27017/inotebook'

const connectToMongo = async ()=>{
    mongoose.connect(mongoURI, {
        useNewUrlParser:true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("Connected to the mongo DB successfully")
    }).catch((err)=>{
        console.log("Error while connecting to the DB",err)
    })
}

module.exports = connectToMongo;
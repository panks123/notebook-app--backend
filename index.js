const connectToMongo = require('./db')
const express = require('express')

var cors = require('cors')
// Database connection - connecting to mongod
connectToMongo()

const app = express()
const port = const port=process.env.PORT || 5000

app.use(cors()) // Middleware - For resolving the front-end cors error 

// Use middleware
app.use(express.json())
/*
* express.json() is a built-in middleware function in Express. This method is used to parse the incoming requests with JSON payloads and is based upon the bodyparser.
* This method returns the middleware that only parses JSON and only looks at the requests where the content-type header matches the type option.
*/ 

app.get('/',(req,res)=>{
    res.send('Hello World')
})

// Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port,()=>{
    console.log(`iNoteBook Backend Listening at port ${port}`)
})
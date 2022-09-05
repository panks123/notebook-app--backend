const mongoose = require('mongoose')
const {Schema} = mongoose;

const UserSchema = new Schema({ 
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        required : true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Creating model from schema
const User = mongoose.model('user', UserSchema) // first parameter 'user' is the model name
User.createIndexes()

module.exports = User
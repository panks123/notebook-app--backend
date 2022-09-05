const mongoose = require('mongoose')
const {Schema} = mongoose;

const NoteSchema = new Schema({ 
    user:{
        type: mongoose.Schema.Types.ObjectId, // To associate a particlar not with the user - It acts a foreign key
        ref: 'user' 
    },
    title: {
        type: String,
        required : true,
        default: 'Untitled'
    },
    content: {
        type: String,
        required : true,
    },
    tag: {
        type: String,
        default: 'General' // For now this 'tag' is not being used (default) value is stored - may use in future to distinguish the notes based on 'tag'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Creating model from schema

module.exports = mongoose.model('notes', NoteSchema)
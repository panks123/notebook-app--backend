const express = require('express')
const router = express.Router()
const fetchuser =require('../middlewares/fetchuser')
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');
const { response } = require('express');

// Route1: To fetch all the notes of a User : Login required
router.get('/fetchallnotes', fetchuser, async (req,res)=>{
    try {
        const notes = await Note.find({user: req.user.id})
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error")
    }
})

// Route2: To add a new note by a logged in user : Log in required
router.post('/addnote', fetchuser, [
    body('title', 'Note Title should not be blank').isLength({min:1}),
    body('content', 'Note Content should not be blank').isLength({min:1})
], async (req,res)=>{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {title, content} = req.body;

        const note =await Note.create({
            user: req.user.id, 
            title, 
            content
        })
        res.json(note);
    } 
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error")
    }
})


// Route3: To update an existing note by a logged in user : Log in required
router.put('/updatenote/:id', fetchuser, async (req, res)=> {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    {
      return res.status(400).json({ errors: errors.array() });
    }
    try 
    {
        const {title, content} = req.body;

        let newNote = {};
        if(title)
        {
            newNote.title = title;
        }
        if(content)
        {
            newNote.content = content;
        }
        

        // Find the note to be updated and then update it

        // Before updating , perfom necessary checks :1. if the note to be updated really exists and 2. if the logged in user is not trying to update someone else's note
        let note = await Note.findById(req.params.id)
        if(!note)
        {
            return res.status(404).send("Not found");
        }

        if(note.user.toString() !== req.user.id)
        {
            return res.status(401).send("Not allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json(note);
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error")
    }
})

// Route3: To update an existing note by a logged in user : Log in required
router.delete('/deletenote/:id', fetchuser, async (req, res)=> {
    try 
    {
        let note = await Note.findById(req.params.id)
        if(!note)
        {
            return res.status(404).send("Not found");
        }

        if(note.user.toString() !== req.user.id)
        {
            return res.status(401).send("Not allowed");
        }

        note =await Note.findByIdAndDelete(req.params.id)
        res.json({"success": "Deleted successfully", note: note})
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error")
    }
})

module.exports =router;
const Note = require('../models/noteModel')
const mongoose = require('mongoose')

// get all notes
const getNotes = async (req, res) => {
  const user_id = req.user._id

  const notes = await Note.find({user_id}).sort({updatedAt: -1})

  res.status(200).json(notes)
}

// get a single note
const getNote = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such note'})
  }

  const note = await Note.findById(id)

  if (!note) {
    return res.status(404).json({error: 'No such note'})
  }
  
  res.status(200).json(note)
}


// create new note
const createNote = async (req, res) => {
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(400).json({ error: 'A note cannot be empty' })
  }

  try {
    const user_id = req.user._id;
    const note = await Note.create({ title, content, user_id });
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a note
const deleteNote = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such note'})
  }

  const note = await Note.findOneAndDelete({_id: id})

  if (!note) {
    return res.status(400).json({error: 'No such note'})
  }

  res.status(200).json(note)
}

// update a note
const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, pinned } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such note' });
  }

  if (!title && !content && pinned === undefined) {
    return res.status(400).json({ error: 'A note cannot be empty' });
  }

  const note = await Note.findOneAndUpdate(
    { _id: id },
    { ...req.body, updatedAt: new Date() }, // Update the updatedAt field
    { new: true } // Return the updated document
  );

  if (!note) {
    return res.status(400).json({ error: 'No such note' });
  }

  res.status(200).json(note);
};


module.exports = {
  getNotes,
  getNote,
  createNote,
  deleteNote,
  updateNote
}
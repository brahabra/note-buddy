const Message = require('../models/messageModel');

// Get all messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).exec();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new message
const createMessage = async (req, res) => {
  const { content, username } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'A message cannot be empty' });
  }

  try {
    const user_id = req.user._id;
    console.log('Received message data:', { content, user_id, username }); // Log the received data

    const message = await Message.create({ content, user_id, username });
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error); // Log the error
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getMessages, createMessage };
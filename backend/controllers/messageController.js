const Message = require('../models/messageModel');
const User = require('../models/userModel');

// Fetch all messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('user', 'username').sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create a new message
const createMessage = async (req, res) => {
  const { content } = req.body;
  const user = req.user._id; // Extract user ID from authenticated user

  try {
    const message = await createMessageHelper({ content, user });
    res.status(200).json(message);
  } catch (error) {
    console.log('Error creating message:', error); // Debugging statement
    res.status(400).json({ error: error.message });
  }
};

// Helper function to create a message
const createMessageHelper = async ({ content, user }) => {
  const messageData = { content, user }; // Ensure user is an ObjectId
  let message = await Message.create(messageData);
  message = await message.populate('user', 'username');
  return message;
};

module.exports = { getMessages, createMessage, createMessageHelper };
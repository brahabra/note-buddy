const Message = require('../models/messageModel');

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

const toggleLikeMessage = async (messageId, userId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error('Message not found');
  }

  const hasLiked = message.likes.includes(userId);

  if (hasLiked) {
    // If already liked, remove the like
    message.likes.pull(userId);
  } else {
    // If not liked, add the like
    message.likes.push(userId);
  }

  await message.save();

  // Populate the likes field with the username
  const populatedMessage = await message.populate('likes', 'username');

  return populatedMessage;
};

const likeMessage = async (req, res) => {
  const { id } = req.params;  // Extracting message ID from URL parameters
  const user_id = req.user._id;

  try {
    const populatedMessage = await toggleLikeMessage(id, user_id);
    res.status(200).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { getMessages, createMessage, createMessageHelper, likeMessage, toggleLikeMessage };
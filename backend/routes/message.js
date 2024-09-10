const express = require('express');
const { getMessages, createMessage, likeMessage } = require('../controllers/messageController');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all note routes
router.use(requireAuth)

// Get all messages
router.get('/', getMessages);

// Create a new message
router.post('/', createMessage);

// Like a message
router.patch('/:id/like', likeMessage);

module.exports = router;
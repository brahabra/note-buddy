const express = require('express');
const { getMessages } = require('../controllers/messageController');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all note routes
router.use(requireAuth)

// Get all messages
router.get('/', getMessages);

module.exports = router;
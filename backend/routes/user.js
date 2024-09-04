const express = require('express');
const { signupUser, loginUser, updateProfilePicture } = require('../controllers/userController');
const { upload } = require('../middleware/upload');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/profile-picture', requireAuth, upload.single('profilePicture'), updateProfilePicture);

module.exports = router;
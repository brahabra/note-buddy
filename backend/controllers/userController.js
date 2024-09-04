const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const path = require('path');
const { deleteOldProfilePicture } = require('../middleware/upload');

const createToken = (_id, username) => {
  return jwt.sign({ _id, username }, process.env.SECRET, { expiresIn: '3d' });
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id, user.username);

    res.status(200).json({
      _id: user._id, // Include the _id field
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      profilePicture: user.profilePicture,
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const user = await User.signup(email, username, password);

    // create a token
    const token = createToken(user._id, user.username);

    res.status(200).json({
      _id: user._id, // Include the _id field
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      profilePicture: user.profilePicture,
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update profile picture
const updateProfilePicture = async (req, res) => {
  const user_id = req.user._id;
  const profilePicture = req.file ? req.file.path : '';

  try {
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the old profile picture if it exists
    if (user.profilePicture) {
      const oldProfilePicturePath = path.join(__dirname, '..', user.profilePicture);
      deleteOldProfilePicture(oldProfilePicturePath);
    }

    // Update the user's profile picture
    user.profilePicture = profilePicture;
    await user.save();

    res.status(200).json({
      _id: user._id, // Include the _id field
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      profilePicture: user.profilePicture,
      token: createToken(user._id, user.username)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser, updateProfilePicture };
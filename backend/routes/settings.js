const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// @route   GET api/settings/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // req.user.id is set by authMiddleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/settings/profile
// @desc    Update user profile (name, email)
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, email, username } = req.body;
  const userId = req.user.id;

  const profileFields = {};
  if (name !== undefined) profileFields.name = name; // Allow empty string for name if desired
  if (email) profileFields.email = email;
  if (username) profileFields.username = username;


  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if email or username is being changed to one that already exists
    if (email && email !== user.email) {
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser && existingEmailUser._id.toString() !== userId) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }
    if (username && username !== user.username) {
      const existingUsernameUser = await User.findOne({ username });
      if (existingUsernameUser && existingUsernameUser._id.toString() !== userId) {
        return res.status(400).json({ msg: 'Username already taken' });
      }
    }

    user = await User.findByIdAndUpdate(
      userId,
      { $set: profileFields },
      { new: true, runValidators: true } // runValidators to ensure email format etc.
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) { // Duplicate key error (e.g. email or username)
        return res.status(400).json({ msg: 'Email or username already exists.' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/settings/password
// @desc    Update user password
// @access  Private
router.put('/password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: 'Please provide current and new passwords' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ msg: 'New password must be at least 6 characters' });
  }

  try {
    const user = await User.findById(userId).select('+password'); // Need to select password to compare
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid current password' });
    }

    user.password = newPassword; // The 'save' pre-hook in User model will hash it
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
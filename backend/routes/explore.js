const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// @route   GET api/explore/trips
// @desc    Get all public trips
// @access  Public
router.get('/trips', async (req, res) => {
  try {
    // Fetch trips where isPublic is true
    // Populate user details, selecting only name and perhaps a profile picture if you add one later
    const publicTrips = await Trip.find({ isPublic: true })
      .populate('user', 'name email') // Adjust fields as necessary
      .sort({ createdAt: -1 }); // Show newest public trips first

    res.json(publicTrips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Optional: Get a specific public trip by ID (if you want a detail view for public trips)
// @route   GET api/explore/trips/:id
// @desc    Get a specific public trip by ID
// @access  Public
router.get('/trips/:id', async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, isPublic: true })
                           .populate('user', 'name email'); // Populate user details

    if (!trip) {
      return res.status(404).json({ msg: 'Public trip not found or not public' });
    }
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Public trip not found' });
    }
    res.status(500).send('Server Error');
  }
});


module.exports = router;
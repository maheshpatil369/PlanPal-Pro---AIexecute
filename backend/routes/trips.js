const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { protect } = require('../middleware/authMiddleware');

// @route   POST api/trips
// @desc    Create a new trip
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { destination, startDate, endDate, description, budget, activities, notes, isPublic } = req.body;
    const newTrip = new Trip({
      user: req.user.id, // From protect middleware
      destination,
      startDate,
      endDate,
      description,
      budget,
      activities,
      notes,
      isPublic,
    });

    const trip = await newTrip.save();
    res.status(201).json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: messages.join(', ') });
    }
    if (err.message.includes('End date must be after start date')) {
        return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/trips
// @desc    Get all trips for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ startDate: -1 });
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/trips/public
// @desc    Get all public trips (for explore page, etc.)
// @access  Public (or Private if only logged-in users can see public trips)
router.get('/public', async (req, res) => { // protect middleware removed for public access
  try {
    const trips = await Trip.find({ isPublic: true }).populate('user', ['username']).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/trips/:id
// @desc    Get a single trip by ID
// @access  Private (user can only get their own trip, unless it's public)
router.get('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Check if the trip belongs to the user or is public
    if (trip.user.toString() !== req.user.id && !trip.isPublic) {
      return res.status(401).json({ msg: 'Not authorized to view this trip' });
    }

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Trip not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/trips/:id
// @desc    Update a trip
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Make sure user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this trip' });
    }

    // Check for end date before start date
    if (req.body.endDate && req.body.startDate && new Date(req.body.endDate) < new Date(req.body.startDate)) {
        return res.status(400).json({ msg: 'End date must be after start date' });
    } else if (req.body.endDate && !req.body.startDate && new Date(req.body.endDate) < new Date(trip.startDate)) {
        return res.status(400).json({ msg: 'End date must be after start date' });
    } else if (!req.body.endDate && req.body.startDate && new Date(trip.endDate) < new Date(req.body.startDate)) {
        return res.status(400).json({ msg: 'End date must be after start date' });
    }


    trip = await Trip.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: messages.join(', ') });
    }
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Trip not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Make sure user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this trip' });
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Trip removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Trip not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/CalendarEvent');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/calendar-events
// @desc    Create a calendar event
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, startDate, endDate, allDay } = req.body;

  try {
    const newEvent = new CalendarEvent({
      title,
      description,
      startDate,
      endDate,
      allDay,
      user: req.user.id,
    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/calendar-events
// @desc    Get all calendar events for the logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await CalendarEvent.find({ user: req.user.id }).sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/calendar-events/:id
// @desc    Get a specific calendar event by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Ensure the event belongs to the logged-in user
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/calendar-events/:id
// @desc    Update a calendar event
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, startDate, endDate, allDay } = req.body;

  const eventFields = {};
  if (title !== undefined) eventFields.title = title;
  if (description !== undefined) eventFields.description = description;
  if (startDate !== undefined) eventFields.startDate = startDate;
  if (endDate !== undefined) eventFields.endDate = endDate;
  if (allDay !== undefined) eventFields.allDay = allDay;

  try {
    let event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Ensure the event belongs to the logged-in user
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    event = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      { $set: eventFields },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/calendar-events/:id
// @desc    Delete a calendar event
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Ensure the event belongs to the logged-in user
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await event.deleteOne();

    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
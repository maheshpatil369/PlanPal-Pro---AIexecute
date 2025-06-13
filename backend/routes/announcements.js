// const express = require('express');
// const router = express.Router();
// const Announcement = require('../models/Announcement');
// const authMiddleware = require('../middleware/authMiddleware'); // Assuming you want to protect these routes

// // @route   POST api/announcements
// // @desc    Create an announcement
// // @access  Private (requires authentication)
// router.post('/', authMiddleware, async (req, res) => {
//   const { title, content } = req.body;

//   try {
//     const newAnnouncement = new Announcement({
//       title,
//       content,
//       author: req.user.id, // Assuming authMiddleware adds user to req
//     });

//     const announcement = await newAnnouncement.save();
//     res.json(announcement);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // @route   GET api/announcements
// // @desc    Get all announcements
// // @access  Public (or Private, depending on your needs)
// router.get('/', async (req, res) => {
//   try {
//     const announcements = await Announcement.find().sort({ createdAt: -1 }).populate('author', ['name', 'email']); // Populate author details
//     res.json(announcements);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // @route   GET api/announcements/:id
// // @desc    Get a specific announcement by ID
// // @access  Public
// router.get('/:id', async (req, res) => {
//   try {
//     const announcement = await Announcement.findById(req.params.id).populate('author', ['name', 'email']);
//     if (!announcement) {
//       return res.status(404).json({ msg: 'Announcement not found' });
//     }
//     res.json(announcement);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Announcement not found' });
//     }
//     res.status(500).send('Server Error');
//   }
// });

// // @route   PUT api/announcements/:id
// // @desc    Update an announcement
// // @access  Private
// router.put('/:id', authMiddleware, async (req, res) => {
//   const { title, content } = req.body;

//   // Build announcement object
//   const announcementFields = {};
//   if (title) announcementFields.title = title;
//   if (content) announcementFields.content = content;

//   try {
//     let announcement = await Announcement.findById(req.params.id);

//     if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

//     // Check user
//     // Ensure the user updating the announcement is the author or an admin
//     // This logic might need adjustment based on your User model and roles
//     if (announcement.author.toString() !== req.user.id) {
//        // Add admin check here if needed: && req.user.role !== 'admin'
//       return res.status(401).json({ msg: 'User not authorized' });
//     }

//     announcement = await Announcement.findByIdAndUpdate(
//       req.params.id,
//       { $set: announcementFields },
//       { new: true }
//     ).populate('author', ['name', 'email']);

//     res.json(announcement);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // @route   DELETE api/announcements/:id
// // @desc    Delete an announcement
// // @access  Private
// router.delete('/:id', authMiddleware, async (req, res) => {
//   try {
//     const announcement = await Announcement.findById(req.params.id);

//     if (!announcement) {
//       return res.status(404).json({ msg: 'Announcement not found' });
//     }

//     // Check user (similar to PUT route)
//     if (announcement.author.toString() !== req.user.id) {
//       // Add admin check here if needed: && req.user.role !== 'admin'
//       return res.status(401).json({ msg: 'User not authorized' });
//     }

//     await announcement.deleteOne(); // or .remove() for older Mongoose versions

//     res.json({ msg: 'Announcement removed' });
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Announcement not found' });
//     }
//     res.status(500).send('Server Error');
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Announcement = require('../models/Announcement');
// const authMiddleware = require('../middleware/authMiddleware');

// // @route   POST /api/announcements
// // @desc    Create an announcement
// // @access  Private
// router.post('/', authMiddleware, async (req, res) => {
//   const { title, content, type, priority, tags, pinned } = req.body;

//   try {
//     const newAnnouncement = new Announcement({
//       title,
//       content,
//       type,
//       priority,
//       tags: tags ? tags.map(tag => tag.trim()) : [],
//       pinned,
//       author: req.user.id,
//     });

//     const saved = await newAnnouncement.save();
//     res.json(saved);
//   } catch (err) {
//     console.error('Error creating announcement:', err.message);
//     res.status(500).json({ success: false, msg: 'Server Error: Could not create announcement', error: err.message });
//   }
// });

// // @route   GET /api/announcements
// // @desc    Get all announcements (with optional filtering)
// router.get('/', async (req, res) => {
//   const { type, search } = req.query;
//   let query = {};

//   if (type && type !== 'all') query.type = type;
//   if (search) query.title = { $regex: search, $options: 'i' };

//   try {
//     const announcements = await Announcement.find(query)
//       .sort({ pinned: -1, createdAt: -1 })
//       .populate('author', ['name', 'email']);
//     res.json(announcements);
//   } catch (err) {
//     console.error('Error fetching announcements:', err.message);
//     res.status(500).json({ success: false, msg: 'Server Error: Could not fetch announcements', error: err.message });
//   }
// });

// // @route   GET /api/announcements/:id
// // @desc    Get announcement by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const announcement = await Announcement.findById(req.params.id).populate('author', ['name', 'email']);
//     if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });
//     res.json(announcement);
//   } catch (err) {
//     console.error('Error fetching announcement by ID:', err.message);
//     res.status(500).json({ success: false, msg: 'Server Error: Could not fetch announcement', error: err.message });
//   }
// });

// // @route   PUT /api/announcements/:id
// // @desc    Update announcement
// // @access  Private
// router.put('/:id', authMiddleware, async (req, res) => {
//   const { title, content, type, priority, tags, pinned } = req.body;

//   const updatedFields = {};
//   if (title) updatedFields.title = title;
//   if (content) updatedFields.content = content;
//   if (type) updatedFields.type = type;
//   if (priority) updatedFields.priority = priority;
//   if (tags) updatedFields.tags = tags.map(tag => tag.trim());
//   if (pinned !== undefined) updatedFields.pinned = pinned;

//   try {
//     let announcement = await Announcement.findById(req.params.id);
//     if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

//     if (announcement.author.toString() !== req.user.id) {
//       return res.status(401).json({ msg: 'User not authorized' });
//     }

//     announcement = await Announcement.findByIdAndUpdate(
//       req.params.id,
//       { $set: updatedFields },
//       { new: true }
//     ).populate('author', ['name', 'email']);

//     res.json(announcement);
//   } catch (err) {
//     console.error('Error updating announcement:', err.message);
//     res.status(500).json({ success: false, msg: 'Server Error: Could not update announcement', error: err.message });
//   }
// });

// // @route   DELETE /api/announcements/:id
// // @desc    Delete announcement
// // @access  Private
// router.delete('/:id', authMiddleware, async (req, res) => {
//   try {
//     const announcement = await Announcement.findById(req.params.id);
//     if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

//     if (announcement.author.toString() !== req.user.id) {
//       return res.status(401).json({ msg: 'User not authorized' });
//     }

//     await announcement.deleteOne();
//     res.json({ msg: 'Announcement deleted' });
//   } catch (err) {
//     console.error('Error deleting announcement:', err.message);
//     res.status(500).json({ success: false, msg: 'Server Error: Could not delete announcement', error: err.message });
//   }
// });

// // @route   POST /api/announcements/:id/like
// // @desc    Like an announcement
// // @access  Private
// router.post('/:id/like', authMiddleware, async (req, res) => {
//   try {
//     const announcement = await Announcement.findById(req.params.id);
//     if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

//     announcement.likes += 1;
//     await announcement.save();

//     res.json({ likes: announcement.likes });
//   } catch (err) {
//     console.error('Error liking announcement:', err.message);
//     res.status(500).json({ success: false, msg: 'Server Error: Could not like announcement', error: err.message });
//   }
// });

// module.exports = router;
// routes/announcementRoutes.js

const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/announcements
// @desc    Create an announcement
// @access  Private
router.post('/', authMiddleware.protect, async (req, res) => {
  const { title, content, type, priority, tags, pinned } = req.body;

  try {
    const newAnnouncement = new Announcement({
      title,
      content,
      type,
      priority,
      tags: tags ? tags.map(tag => tag.trim()) : [],
      pinned: pinned || false,
      author: req.user.id,
    });

    const saved = await newAnnouncement.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('--- DETAILED ERROR WHEN CREATING ANNOUNCEMENT ---');
    console.error('Error Object:', err);
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
    console.error('--- END DETAILED ERROR ---');
    res.status(500).json({ success: false, msg: 'Server Error: Could not create announcement. Check backend logs for details.', error: err.message });
  }
});

// @route   GET /api/announcements
// @desc    Get all announcements (with optional filtering)
router.get('/', async (req, res) => {
  const { type, search } = req.query;
  let query = {};

  if (type && type !== 'all') query.type = type;
  if (search) query.title = { $regex: search, $options: 'i' };

  try {
    const announcements = await Announcement.find(query)
      .sort({ pinned: -1, createdAt: -1 })
      .populate('author', ['name', 'email']);
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err.message);
    res.status(500).json({ success: false, msg: 'Server Error: Could not fetch announcements', error: err.message });
  }
});

// @route   GET /api/announcements/:id
// @desc    Get announcement by ID
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate('author', ['name', 'email']);
    if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });
    res.json(announcement);
  } catch (err) {
    console.error('Error fetching announcement by ID:', err.message);
    res.status(500).json({ success: false, msg: 'Server Error: Could not fetch announcement', error: err.message });
  }
});

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Private
router.put('/:id', authMiddleware.protect, async (req, res) => {
  const { title, content, type, priority, tags, pinned } = req.body;

  const updatedFields = {};
  if (title) updatedFields.title = title;
  if (content) updatedFields.content = content;
  if (type) updatedFields.type = type;
  if (priority) updatedFields.priority = priority;
  if (tags) updatedFields.tags = tags.map(tag => tag.trim());
  if (pinned !== undefined) updatedFields.pinned = pinned;

  try {
    let announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

    if (announcement.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    ).populate('author', ['name', 'email']);

    res.json(announcement);
  } catch (err) {
    console.error('Error updating announcement:', err.message);
    res.status(500).json({ success: false, msg: 'Server Error: Could not update announcement', error: err.message });
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private
router.delete('/:id', authMiddleware.protect, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

    if (announcement.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await announcement.deleteOne();
    res.json({ msg: 'Announcement deleted' });
  } catch (err) {
    console.error('Error deleting announcement:', err.message);
    res.status(500).json({ success: false, msg: 'Server Error: Could not delete announcement', error: err.message });
  }
});

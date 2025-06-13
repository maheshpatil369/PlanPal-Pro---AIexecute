// const mongoose = require('mongoose');

// const announcementSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Assuming you have a User model
//     required: false, // Or true, depending on whether an author is mandatory
//   },
//   // You can add other fields like 'category', 'tags', 'expiryDate', etc.
// }, { timestamps: true });

// module.exports = mongoose.model('Announcement', announcementSchema);

// models/Announcement.js

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['update', 'important', 'opportunity', 'meeting', 'welcome'],
    default: 'update',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  tags: {
    type: [String], // comma-separated tags converted to array
    default: [],
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // set to true if you want to restrict to logged-in users
  },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);

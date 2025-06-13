const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  read: { // To track if the message has been read by the receiver
    type: Boolean,
    default: false,
  }
  // You could add a 'chatId' or 'conversationId' if you plan to group messages
  // into explicit chat rooms or conversations later.
}, { timestamps: true });

// Index for faster querying of conversations
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ receiver: 1, createdAt: -1 }); // For fetching recent messages for a user

module.exports = mongoose.model('Message', messageSchema);
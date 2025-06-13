const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User'); // To validate receiver exists
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/chat/send/:receiverId
// @desc    Send a message to another user
// @access  Private
router.post('/send/:receiverId', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const { receiverId } = req.params;
  const senderId = req.user.id;

  if (!content) {
    return res.status(400).json({ msg: 'Message content cannot be empty' });
  }

  if (senderId === receiverId) {
    return res.status(400).json({ msg: 'Cannot send message to yourself' });
  }

  try {
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ msg: 'Receiver not found' });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    const message = await newMessage.save();
    // TODO: Implement real-time notification (e.g., WebSockets)
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/chat/conversation/:otherUserId
// @desc    Get conversation history with another user
// @access  Private
router.get('/conversation/:otherUserId', authMiddleware, async (req, res) => {
  const currentUserId = req.user.id;
  const otherUserId = req.params.otherUserId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
    .populate('sender', ['name', 'email']) // or just 'name'
    .populate('receiver', ['name', 'email']) // or just 'name'
    .sort({ createdAt: 1 }); // Sort by oldest first for conversation flow

    // Optionally, mark messages as read when fetched
    // await Message.updateMany(
    //   { receiver: currentUserId, sender: otherUserId, read: false },
    //   { $set: { read: true } }
    // );

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/chat/conversations
// @desc    Get a list of recent conversations for the logged-in user
// @access  Private
router.get('/conversations', authMiddleware, async (req, res) => {
  const currentUserId = req.user.id;
  try {
    // This is a more complex query. It aims to get the last message for each conversation.
    // One way to do this is to get all messages involving the user, then group them.
    // For a more performant solution with many messages, consider denormalization or specific aggregation.

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: mongoose.Types.ObjectId(currentUserId) }, { receiver: mongoose.Types.ObjectId(currentUserId) }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', mongoose.Types.ObjectId(currentUserId)] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$lastMessage' },
      },
      {
        $lookup: { // Populate sender
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'senderDetails',
        },
      },
      {
        $unwind: '$senderDetails'
      },
      {
        $lookup: { // Populate receiver
          from: 'users',
          localField: 'receiver',
          foreignField: '_id',
          as: 'receiverDetails',
        },
      },
      {
        $unwind: '$receiverDetails'
      },
      {
        $project: { // Select and rename fields for clarity
          _id: 1,
          content: 1,
          createdAt: 1,
          read: 1,
          sender: { _id: '$senderDetails._id', name: '$senderDetails.name', email: '$senderDetails.email' },
          receiver: { _id: '$receiverDetails._id', name: '$receiverDetails.name', email: '$receiverDetails.email' },
          // Determine the 'other user' in the conversation
          otherUser: {
            $cond: {
              if: { $eq: ['$senderDetails._id', mongoose.Types.ObjectId(currentUserId)] },
              then: { _id: '$receiverDetails._id', name: '$receiverDetails.name', email: '$receiverDetails.email' },
              else: { _id: '$senderDetails._id', name: '$senderDetails.name', email: '$senderDetails.email' },
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }, // Sort conversations by the most recent message
      }
    ]);

    res.json(messages);
  } catch (err) {
    console.error('Error fetching conversations:', err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT api/chat/read/:chatPartnerId
// @desc    Mark messages from a specific user as read
// @access  Private
router.put('/read/:chatPartnerId', authMiddleware, async (req, res) => {
  const currentUserId = req.user.id;
  const chatPartnerId = req.params.chatPartnerId;

  try {
    const result = await Message.updateMany(
      { sender: chatPartnerId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );
    res.json({ msg: `${result.nModified} messages marked as read.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
// Note: For a production-ready chat, consider using WebSockets (e.g., Socket.IO)
// for real-time message delivery and presence indicators.
// The current implementation is based on HTTP polling.
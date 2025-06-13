require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow specific origin
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); 
  }
};

connectDB();

app.get('/', (req, res) => {
  res.send('Backend server is running');
});

app.use('/api/items', require('./routes/items'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
// app.use('/api/announcements', require('./routes/announcements')); // This line is now redundant
app.use('/api/calendar-events', require('./routes/calendarEvents'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/explore', require('./routes/explore'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/teams', require('./routes/teams'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
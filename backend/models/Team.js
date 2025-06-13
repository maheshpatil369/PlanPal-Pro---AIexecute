const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a team name'],
    trim: true,
    unique: true, // Assuming team names should be unique, adjust if not
  },
  description: {
    type: String,
    trim: true,
  },
  admin: { // The user who created and manages the team
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{ // List of users who are part of the team
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // You could add shared resources like trips, documents, etc. here later
  // For example:
  // sharedTrips: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Trip',
  // }],
}, { timestamps: true });

// Ensure the admin is also part of the members list when a team is created/saved
teamSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('admin')) {
    // Add admin to members list if not already present
    if (!this.members.includes(this.admin)) {
      this.members.push(this.admin);
    }
  }
  next();
});

module.exports = mongoose.model('Team', teamSchema);
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  sport: { type: String, required: true },
  ageGroup: { type: String, required: true },
  matchType: { type: String, enum: ['knockout', 'league'], required: true },
  players: [{ type: String, required: true }], // Array of player names
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
});

module.exports = mongoose.model('Event', eventSchema);

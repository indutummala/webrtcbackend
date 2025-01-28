const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dateTime: { type: Date, required: true },
  participants: { type: [String], default: [] },
});

module.exports = mongoose.model("Meeting", meetingSchema);

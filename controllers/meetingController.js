const Meeting = require("../models/Meeting");

// Create a new meeting
exports.createMeeting = async (req, res) => {
  const { title, dateTime } = req.body;
  
  try {
    // Check if meeting title is provided
    if (!title || !dateTime) {
      return res.status(400).json({ error: "Title and dateTime are required" });
    }

    // Create a new meeting object
    const newMeeting = new Meeting({
      title,
      dateTime,
      participants: [],  // Optional: You can initialize participants as an empty array
    });

    // Save the meeting to the database
    await newMeeting.save();

    // Return meeting details, including the generated link
    res.status(201).json({
      meetingId: newMeeting._id,
      link: `http://localhost:3000/meeting/${newMeeting._id}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create meeting" });
  }
};

// Join a meeting
exports.joinMeeting = async (req, res) => {
  const { meetingId, user } = req.body;

  try {
    // Validate user and meeting ID
    if (!meetingId || !user) {
      return res.status(400).json({ error: "Meeting ID and user are required" });
    }

    // Find the meeting by ID
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    // Add user to the participants list
    meeting.participants.push(user);
    await meeting.save();

    // Respond with success message
    res.json({ message: "Successfully joined the meeting" });
  } catch (err) {
    res.status(500).json({ error: "Failed to join meeting" });
  }
};

// Get meeting details
exports.getMeeting = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the meeting by ID
    const meeting = await Meeting.findById(id);
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    // Return meeting details
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meeting details" });
  }
};

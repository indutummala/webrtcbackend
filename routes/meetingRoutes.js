const express = require("express");
const {
  createMeeting,
  joinMeeting,
  getMeeting,
} = require("../controllers/meetingController");

const router = express.Router();

router.post("/create", createMeeting); // Create a meeting

router.post("/join", joinMeeting);    // Join a meeting
router.get("/:id", getMeeting);      // Get meeting details

module.exports = router;

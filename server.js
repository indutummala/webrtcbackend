const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const meetingRoutes = require("./routes/meetingRoutes");
require('dotenv').config();

// Initialize the express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to your frontend's URL
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes for handling meeting-related API calls
app.use("/api/meetings", meetingRoutes);

// WebRTC signaling logic using socket.io
io.on("connection", (socket) => {
  console.log("New user connected");

  // When a user joins a room
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId); // Join the specific room
    console.log(`User ${userId} joined room ${roomId}`);
    socket.to(roomId).emit("user-connected", userId); // Notify others in the room that a new user has connected

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
      socket.to(roomId).emit("user-disconnected", userId); // Notify others in the room that the user has disconnected
    });
  });

  // Handle receiving offers from peers and forwarding them to the other user
  socket.on("offer", (offer) => {
    console.log("Received offer:", offer);
    socket.to(offer.roomId).emit("offer", offer); // Forward the offer to the other user in the room
  });

  // Handle receiving answers from peers and forwarding them to the other user
  socket.on("answer", (answer) => {
    console.log("Received answer:", answer);
    socket.to(answer.roomId).emit("answer", answer); // Forward the answer to the other user in the room
  });

  // Handle receiving ICE candidates and forwarding them to the other user
  socket.on("ice-candidate", (candidate) => {
    console.log("Received ICE candidate:", candidate);
    socket.to(candidate.roomId).emit("ice-candidate", candidate); // Forward the ICE candidate to the other user in the room
  });
});

// Start the server on the specified port (5000)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

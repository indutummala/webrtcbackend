const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use the connection string from the .env file
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);  // Exit the application if MongoDB connection fails
  }
};

module.exports = connectDB;

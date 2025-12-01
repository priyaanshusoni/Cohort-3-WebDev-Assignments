const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbUrl = process.env.MONGO_URI;
    console.log(`Connecting to MongoDB at ${dbUrl}`);
    await mongoose.connect(dbUrl);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = {
  connectDB,
};

const mongoose = require("mongoose");

// Define schemas

const UserSchema = new mongoose.Schema({
  // Schema definition here

  name: String,
  email: String,
  password: String,
});

const TodoSchema = new mongoose.Schema({
  // Schema definition here
  title: String,
  completed: Boolean,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", TodoSchema);

module.exports = {
  User,
  Todo,
};

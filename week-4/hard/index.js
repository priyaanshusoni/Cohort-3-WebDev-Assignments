const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/dbConnect.js");
const { Todo, User } = require("./database/index.js");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("./middleware/user.js");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api/v1/todos", userMiddleware);

app.post("/api/v1/users/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const response = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      message: "User registered succesfully !",
      response,
    });
  } catch (error) {
    console.error("Error while registering the user ", error);
    return res.status(500).json({
      message: error,
    });
  }
});

app.post("/api/v1/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email,
      password: password,
    });

    if (!user) return res.status(401).json({ message: "Unautorized" });

    const token = jwt.sign(email, process.env.TOKEN_KEY);

    return res.status(200).json({
      message: "Logged In Succesfully !",
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error while logging in",
      error,
    });
  }
});
app.post("/api/v1/todos/add", async (req, res) => {
  try {
    const { title, completed } = req.body;

    console.log(title, completed);

    if (!title) {
      return res.status(400).json({
        message: "Please Provide complete details",
      });
    }

    const user = await User.findOne({
      email: req.user,
    });

    const response = await Todo.create({
      title,
      completed,
      createdBy: user._id,
    });

    res.status(201).json({
      success: true,
      message: "Todo added successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add todo",
    });
  }
});

app.put("/api/v1/todos/mark/:id/:state", async (req, res) => {
  try {
    const { title, completed } = req.body;

    const { state, id } = req.params;

    const user = await User.findOne({
      email: req.user,
    });

    if (!title) {
      return res.status(400).json({
        message: "Please Provide complete details",
      });
    }

    const todo = Todo.findOne({
      _id: id,
      createdBy: user._id,
    });

    if (!todo)
      return res.status(400).json({
        message: "No todo found to update",
      });
    const response = await todo.updateOne({
      completed: state,
    });

    res.status(201).json({
      success: true,
      message: "Todo added successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add todo",
    });
  }
});

app.delete("/api/v1/todos/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      email: req.user,
    });

    const todo = await Todo.findOneAndDelete({
      _id: id,
      createdBy: user._id,
    });

    console.log("Todo to be deleted ", todo);

    if (!todo)
      return res.status(400).json({
        message: "No todo found to delete",
      });

    res.status(201).json({
      success: true,
      message: "Todo deleted successfully",
      data: todo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete todo",
    });
  }
});

app.get("/api/v1/todos", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.user,
    });

    const todos = await Todo.find({
      createdBy: user._id,
    });

    return res.status(200).json({
      message: "Todos fetched successfully",
      todos,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
});

async function main() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server has started on port http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

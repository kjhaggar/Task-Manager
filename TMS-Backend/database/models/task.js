const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String },
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  email: { type: String },
});

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    trim: true,
  },
  _listId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  assignedTo: [userSchema],
  status: {
    type: String,
    default: "Pending",
  },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;

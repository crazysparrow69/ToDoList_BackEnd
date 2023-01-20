const { validationResult } = require("express-validator");
const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Incorrect data", errors: errors.array() });
    }

    const doc = new Task({
      title: req.body.title,
      description: req.body.description,
      categories: req.body.categories,
      user: req.userId,
      deadline: req.deadline || null,
      isCompleted: req.body.isCompleted,
    });

    const task = await doc.save();

    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not create task",
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("user");
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not get tasks",
    });
  }
};

const getTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) return res.statys(400).json({ message: "Id required" });
    Task.findOne({ _id: taskId }, function (err, doc) {
      if (err) return res.status(500).json({ message: "Cannot return task" });
      if (!doc)
        return res.status(404).json({ message: "Task cannot be found" });
      res.json(doc);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not get task",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) return res.statys(400).json({ message: "Id required" });
    Task.findOneAndDelete({ _id: taskId }, function (err, doc) {
      if (err) return res.status(500).json({ message: "Cannot delete task" });
      if (!doc)
        return res.status(404).json({ message: "Task cannot be found" });
    });
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not delete task",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) return res.statys(400).json({ message: "Id required" });
    Task.findOneAndUpdate(
      { _id: taskId },
      {
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
        deadline: req.body.deadline,
      },
      function (err, doc) {
        if (err) return res.status(500).json({ message: "Cannot update task" });
        if (!doc)
          return res.status(404).json({ message: "Task cannot be found" });
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not update task",
    });
  }
};

module.exports = { createTask, getAllTasks, getTask, deleteTask, updateTask };

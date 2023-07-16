const { validationResult, query } = require("express-validator");
const Task = require("../models/Task");
const User = require("../models/User");
const mongoose = require("mongoose");

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
      user: req.user._id.toString(),
      deadline: req.body.deadline ? new Date(req.body.deadline) : null,
      isCompleted: req.body.isCompleted,
      links: req.body.links,
    });

    const task = await doc.save();

    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const count = await Task.countDocuments(req.queryParams);

    if (count === 0)
      return res.json({
        categories: [],
        totalPages: 0,
        currentPage: 1,
      });

    const totalPages = Math.ceil(count / limit);
    if (page > totalPages)
      return res.status(404).json({
        message: "Tasks page not found",
        totalPages,
      });

    const tasks = await Task.find(req.queryParams)
      .populate("categories")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.json({
      tasks,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) return res.status(400).json({ message: "Id required" });

    const foundTask = await Task.findOne({ _id: taskId });
    if (!foundTask) return res.status(404).json({ message: "Could not find the task" });

    res.json(foundTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) return res.status(400).json({ message: "Id required" });

    const deletedTask = await Task.findOneAndDelete({ _id: taskId });
    if (!deletedTask) return res.status(404).json({ message: "Could not find the task" });

    res.json(deletedTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Incorrect data", errors: errors.array() });
  }

  const taskId = req.params.id;

  try {
    const taskData = {
      title: req.body.title,
      description: req.body.description,
      categories: req.body.categories,
      deadline: req.body.deadline,
      links: req.body.links,
    };
    const isCompleted = req.body.isCompleted;

    if (isCompleted === true) {
      taskData.isCompleted = true;
      taskData.dateOfCompletion = new Date();
    } else if (isCompleted === false) {
      taskData.isCompleted = false;
      taskData.dateOfCompletion = null;
    }

    await Task.findOneAndUpdate({ _id: taskId }, taskData);

    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const shareTask = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ message: "Id required" });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Incorrect data", errors: errors.array() });
    }

    const shareToUser = await User.findOne({
      _id: req.body.shareTo,
    });

    if (!shareToUser)
      return res
        .status(404)
        .json({ message: "Could not find the user to share the task with" });

    const shareFromUser = await User.findOne({
      _id: req.user._id.toString(),
    });

    if (!shareFromUser)
      return res
        .status(404)
        .json({ message: "Could not find the user to share the task from" });

    const foundTask = await Task.findOneAndUpdate(
      {
        user: req.user._id.toString(),
        _id: req.params.id,
      },
      {
        $push: {
          sharedWith: {
            userId: shareToUser._id,
            username: shareToUser.username,
          },
        },
      }
    );

    if (!foundTask)
      return res.status(404).json({ message: "Could not find the task" });

    const doc = new Task({
      title: `${foundTask.title} (shared from ${shareFromUser.username})`,
      description: foundTask.description,
      sharedWith: "already shared",
      isCompleted: false,
      deadline: foundTask.deadline,
      dateOfCompletion: null,
      user: req.body.shareTo,
    });

    const copiedTask = await doc.save();

    if (!copiedTask)
      return res.status(400).json({ message: "Could not create copied task" });

    res.json(copiedTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const stats = await req.user.getStats();

    res.json(stats);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTask,
  deleteTask,
  updateTask,
  shareTask,
  getTaskStats
};

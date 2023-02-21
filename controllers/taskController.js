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
      message: "Internal server error",
    });
  }
};

const getAllTasks = async (req, res) => {
  const { page = 1, limit = 10, ...params } = req.query;

  try {
    const count = await Task.countDocuments({ user: req.userId, ...params });
    if (count === 0) return res.json({
      categories: [],
      totalPages: 0,
      currentPage: 1
    });
     
    const totalPages = Math.ceil(count / limit);
    if (page > totalPages)
      return res.status(404).json({
        message: "Tasks page not found",
        totalPages,
      });
    
    const tasks = await Task
      .find({ user: req.userId, ...params })
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
    if (!taskId) return res.statys(400).json({ message: "Id required" });

    Task.findOne({ _id: taskId }, function (err, doc) {
      if (err) return res.status(500).json({ message: "Internal server error" });
      if (!doc)
        return res.status(404).json({ message: "Could not find task" });

      res.json(doc);
    });

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
    if (!taskId) return res.statys(400).json({ message: "Id required" });

    Task.findOneAndDelete({ _id: taskId }, function (err, doc) {
      if (err) return res.status(500).json({ message: "Internal server error" });
      if (!doc)
        return res.status(404).json({ message: "Could not find task" });
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
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
        if (err) return res.status(500).json({ message: "Internal server error" });
        if (!doc)
          return res.status(404).json({ message: "Could not find task" });
      }
    );

    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { createTask, getAllTasks, getTask, deleteTask, updateTask };

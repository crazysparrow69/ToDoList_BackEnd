const { validationResult, query } = require("express-validator");
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
      deadline: req.body.deadline ? new Date(req.body.deadline) : null,
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
  const { page = 1, limit = 10, deadline = "month", ...params } = req.query;

  try {
    const date = new Date();
    const year = date.getFullYear();
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const day = date.getDate();
    const todayMidnight = new Date(`${year}-${month}-${day}`);

    let queryParams;

    if (deadline === "all") {
      queryParams = {
        user: req.userId,
        ...params,
      };
    } else if (deadline === "day") {
      queryParams = {
        user: req.userId,
        deadline: todayMidnight,
        ...params,
      };
    } else if (deadline == "week") {
      const today = new Date(`${year}-${month}-${day}`);
      queryParams = {
        user: req.userId,
        deadline: {
          $gte: todayMidnight,
          $lte: new Date(today.setDate(today.getDate() + 7)),
        },
        ...params,
      };
    } else if (deadline === "month") {
      const today = new Date(`${year}-${month}-${day}`);
      queryParams = {
        user: req.userId,
        deadline: {
          $gte: todayMidnight,
          $lte: new Date(today.setMonth(today.getMonth() + 1)),
        },
        ...params,
      };
    } else if (deadline === "year") {
      queryParams = {
        user: req.userId,
        deadline: {
          $gte: todayMidnight,
          $lte: new Date(`${year + 1}-${month}-${day}`),
        },
        ...params,
      };
    } else {
      return res.status(404).json({
        message: "Tasks page not found",
        totalPages,
      });
    }

    const count = await Task.countDocuments(queryParams);

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

    const tasks = await Task.find(queryParams)
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

    await Task.findOne({ _id: taskId }, function (err, doc) {
      if (err)
        return res.status(500).json({ message: "Internal server error" });
      if (!doc) return res.status(404).json({ message: "Could not find task" });

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
    if (!taskId) return res.status(400).json({ message: "Id required" });

    await Task.findOneAndDelete({ _id: taskId }, function (err, doc) {
      if (err)
        return res.status(500).json({ message: "Internal server error" });
      if (!doc) return res.status(404).json({ message: "Could not find task" });
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
    if (!taskId) return res.status(400).json({ message: "Id required" });

    await Task.findOneAndUpdate(
      { _id: taskId },
      {
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
        deadline: req.body.deadline,
        isCompleted: req.body.isCompleted,
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

const shareTask = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ message: "Id required" });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Incorrect data", errors: errors.array() });
    }

    const foundTask = await Task.findOneAndUpdate(
      { _id: req.params.id },
      {
        sharedWith: req.body.sharedWith,
      },
    );

    if (!foundTask)
      return res.status(404).json({ message: "Could not find the task" });

    res.json(foundTask);
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
};

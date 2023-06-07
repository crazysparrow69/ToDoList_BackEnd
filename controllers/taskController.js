const { validationResult, query } = require("express-validator");
const Task = require("../models/Task");
const User = require("../models/User");

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
  const {
    page = 1,
    limit = 10,
    deadline = "all",
    categories = [],
    ...params
  } = req.query;

  try {
    const date = new Date();
    const year = date.getFullYear();
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const day = date.getDate();
    const todayMidnight = new Date(`${year}-${month}-${day}`);

    let queryParams = {
      user: req.userId,
      ...params,
    };

    if (categories.length === 1) {
      queryParams.categories = {
        $elemMatch: {
          _id: categories[0]._id,
        },
      };
    } else if (categories.length > 1) {
      const queryArr = [];
      categories.forEach((elem) =>
        queryArr.push({ categories: { $elemMatch: { _id: elem._id } } })
      );
      queryParams.$and = queryArr;
    }

    if (deadline === "all") {
      queryParams = queryParams;
    } else if (deadline === "day") {
      queryParams.deadline = todayMidnight;
    } else if (deadline == "week") {
      const today = new Date(`${year}-${month}-${day}`);
      queryParams.deadline = {
        $gte: todayMidnight,
        $lte: new Date(today.setDate(today.getDate() + 7)),
      };
    } else if (deadline === "month") {
      const today = new Date(`${year}-${month}-${day}`);
      queryParams.deadline = {
        $gte: todayMidnight,
        $lte: new Date(today.setMonth(today.getMonth() + 1)),
      };
    } else if (deadline === "year") {
      queryParams.deadline = {
        $gte: todayMidnight,
        $lte: new Date(`${year + 1}-${month}-${day}`),
      };
    } else if (deadline === "outdated") {
      queryParams.deadline = {
        $lt: todayMidnight,
      };
    } else {
      return res.status(404).json({ message: "Tasks page not found" });
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
  const taskId = req.params.id;
  if (!taskId) return res.status(400).json({ message: "Id required" });
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Incorrect data", errors: errors.array() });
  }

  try {
    let taskData;
    const isCompleted = req.body.isCompleted;

    if (isCompleted === true) {
      taskData = {
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
        deadline: req.body.deadline,
        isCompleted: true,
        dateOfCompletion: new Date(),
      };
    } else if (isCompleted === false) {
      taskData = {
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
        deadline: req.body.deadline,
        isCompleted: false,
        dateOfCompletion: null,
      };
    } else {
      taskData = {
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
        deadline: req.body.deadline,
      };
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
      _id: req.userId,
    });

    if (!shareFromUser)
      return res
        .status(404)
        .json({ message: "Could not find the user to share the task from" });

    const foundTask = await Task.findOneAndUpdate(
      {
        user: req.userId,
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
  const date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate();
  const tomorrowMidnight = new Date(`${year}-${month}-${day + 1}`);

  try {
    const today = new Date(`${year}-${month}-${day}`);
    const foundTasks = await Task.find({
      user: req.userId,
      dateOfCompletion: {
        $lte: tomorrowMidnight,
        $gte: new Date(today.setDate(today.getDate() - 10)),
      },
    });

    const stats = [];

    for (let i = 0; i < 10; i++) {
      const now = new Date(`${year}-${month}-${day}`);
      const now2 = new Date(`${year}-${month}-${day}`);
      const now3 = new Date(`${year}-${month}-${day}`);

      const dayStats = {
        date: new Date(now.setDate(now.getDate() - i)),
        counter: 0,
      };

      const dayBefore = new Date(now2.setDate(now2.getDate() - i));
      const dayAfter = new Date(now3.setDate(now3.getDate() - i + 1));

      foundTasks.forEach((task) => {
        if (
          task.dateOfCompletion >= dayBefore &&
          task.dateOfCompletion < dayAfter
        ) {
          dayStats.counter++;
        }
      });

      stats.push(dayStats);
    }

    stats.reverse();

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

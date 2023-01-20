const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const doc = new Task({
      title: req.body.title,
      description: req.body.description,
      categories: req.body.tags,
      user: req.userId,
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

module.exports = { createTask };

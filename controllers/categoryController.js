const { validationResult } = require("express-validator");
const Category = require("../models/Category");

const getOneCategory = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ message: "Id required" });

    const category = await Category.findOne({ _id: req.params.id });

    if (!category) return res.status(404).json({ message: "Could not find" });

    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not get category",
    });
  }
};

const getCategories = async (req, res) => {
  const { page = 1, limit = 10, ...params } = req.query;

  try {
    const count = await Category.countDocuments({
      user: req.userId,
      ...params,
    });
    if (count === 0)
      return res.json({
        categories: [],
        totalPages: 0,
        currentPage: 1,
      });

    const totalPages = Math.ceil(count / limit);
    if (page > totalPages)
      return res.status(404).json({
        message: "Categories page not found",
        totalPages,
      });

    const categories = await Category.find({ user: req.userId, ...params })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.json({
      categories,
      totalPages,
      currentPage: +page,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Could not get category",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Incorrect data", errors: errors.array() });
    }

    // const foundCategory = Category.findOne({ title: req.body.title });
    // if (foundCategory) {
    //   console.log(foundCategory)
    //   return res.status(400).json({ message: "Title already in use" });
    // }

    const doc = new Category({
      title: req.body.title,
      color: req.body.color,
      user: req.userId,
    });

    const category = await doc.save();

    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not create category",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ message: "Id required" });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Incorrect data", errors: errors.array() });
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        color: req.body.color,
      }
    );

    if (!category) return res.status(404).json({ message: "Could not find" });

    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not update category",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ message: "Id required" });

    const category = await Category.findOneAndDelete({ _id: req.params.id });

    if (!category) return res.status(404).json({ message: "Could not find" });

    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not delete category",
    });
  }
};

module.exports = {
  getOneCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

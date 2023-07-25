const mongoose = require("mongoose");

const setTaskQueryParams = (req, res, next) => {
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

    const queryParams = {
      user: req.user._id.toString(),
      ...params,
    };

    if (categories.length === 1) {
      queryParams.categories = mongoose.Types.ObjectId(categories[0]._id);
    } else if (categories.length > 1) {
      const categoriesIds = req.query.categories.map(elem => mongoose.Types.ObjectId(elem._id));
      queryParams.categories = { $all: categoriesIds };
    }

    if (deadline === "day") {
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
    } else if (deadline === "nodeadline") {
      queryParams.deadline = null;
    } else if (deadline !== "all") {
      return res.status(404).json({ message: "Tasks page not found" });
    }

    console.log(queryParams);
    req.queryParams = queryParams;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  setTaskQueryParams,
};

const { validationResult } = require("express-validator");
const {
  getOneCategory
} = require("./categoryController");
const Category = require("../models/Category");
const Task = require("../models/Task");

jest.mock("express-validator");
jest.mock("../models/Category");
jest.mock("../models/Task");

const req = { params: {}, query: {}, body: {}, userId: "user123" };
const result = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const resetMocks = () => {
  validationResult.mockReset();
  Category.findOne.mockReset();
  Category.countDocuments.mockReset();
  Category.find.mockReset();
  Category.findOneAndUpdate.mockReset();
  Category.findOneAndDelete.mockReset();
  Task.find.mockReset();
  Task.findOneAndUpdate.mockReset();
};

describe("getOneCategory", () => {
  beforeEach(() => {
    resetMocks();
  });

  test("should return the category if found", async () => {
    const foundCategory = { _id: "category123", title: "Category 1" };
    Category.findOne.mockResolvedValue(foundCategory);

    req.params.id = "category123";
    await getOneCategory(req, result);

    expect(Category.findOne).toHaveBeenCalledWith({ _id: "category123" });
    expect(result.json).toHaveBeenCalledWith(foundCategory);
  });
});
const { validationResult } = require("express-validator");
const {
  getOneCategory,
  getCategories
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
  
  test("should return 404 if category not found", async () => {
    Category.findOne.mockResolvedValue(null);

    req.params.id = "category123";
    await getOneCategory(req, result);

    expect(Category.findOne).toHaveBeenCalledWith({ _id: "category123" });
    expect(result.status).toHaveBeenCalledWith(404);
    expect(result.json).toHaveBeenCalledWith({ message: "Could not find category" });
  });

  test("should return 400 if id is not provided", async () => {
    req.params.id = undefined;
    await getOneCategory(req, result);

    expect(result.status).toHaveBeenCalledWith(400);
    expect(result.json).toHaveBeenCalledWith({ message: "Id required" });
  });

  test("should return 500 if an error occurs", async () => {
    const error = new Error("Internal server error");
    Category.findOne.mockRejectedValue(error);

    req.params.id = "category123";
    await getOneCategory(req, result);

    expect(Category.findOne).toHaveBeenCalledWith({ _id: "category123" });
    expect(result.status).toHaveBeenCalledWith(500);
    expect(result.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});

describe("getCategories", () => {
    beforeEach(() => {
      resetMocks();
    });
  
    test("should return the categories if found", async () => {
      const categories = [
        { _id: "category1", title: "Category 1" },
        { _id: "category2", title: "Category 2" },
      ];
      Category.countDocuments.mockResolvedValue(2);
      Category.find.mockResolvedValue(categories);
  
      req.query.page = 1;
      req.query.limit = 10;
      await getCategories(req, result);
  
      expect(Category.countDocuments).toHaveBeenCalledWith({ user: "user123" });
      expect(Category.find).toHaveBeenCalledWith({ user: "user123" });
    });
  });
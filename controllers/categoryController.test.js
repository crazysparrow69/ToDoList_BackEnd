const { validationResult } = require("express-validator");
const {
  getOneCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
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

describe("createCategory", () => {
  beforeEach(() => {
    resetMocks();
  });
  
  test("should create a new category", async () => {
    const categoryData = { title: "New Category", color: "blue" };
    const savedCategory = { _id: "category123", ...categoryData };
    validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
    Category.findOne.mockResolvedValue(null);
    Category.prototype.save.mockResolvedValue(savedCategory);
  
    req.body = categoryData;
    await createCategory(req, result);
  
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(Category.findOne).toHaveBeenCalledWith({
      user: "user123",
      title: "New Category",
    });
    expect(Category.prototype.save).toHaveBeenCalled();
    expect(result.json).toHaveBeenCalledWith(savedCategory);
  });
});

describe("updateCategory", () => {
  beforeEach(() => {
    resetMocks();
  });
  
  test("should update the category and associated tasks", async () => {
    const updatedCategory = { _id: "category123", title: "Updated Category", color: "red" };
    const foundTasks = [
      { _id: "task1", categories: [{ _id: "category123", title: "Category 1", color: "blue" }] },
      { _id: "task2", categories: [{ _id: "category123", title: "Category 1", color: "blue" }] },
    ];
    validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
    Category.findOneAndUpdate.mockResolvedValue(updatedCategory);
    Task.find.mockResolvedValue(foundTasks);
    Task.findOneAndUpdate.mockResolvedValue();
  
    req.params.id = "category123";
    req.body = { title: "Updated Category", color: "red" };
    await updateCategory(req, result);
  
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(Category.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "category123" },
      { title: "Updated Category", color: "red" }
    );
    expect(Task.find).toHaveBeenCalledWith({
      categories: { $elemMatch: { _id: "category123" } },
    });
    expect(Task.findOneAndUpdate).toHaveBeenCalledTimes(2); // Once for each found task
    expect(result.json).toHaveBeenCalledWith(updatedCategory);
  });
});

describe("deleteCategory", () => {
  beforeEach(() => {
    resetMocks();
  });

  test("should delete the category and update associated tasks", async () => {
    const deletedCategory = { _id: "category123", title: "Category 1" };
    const foundTasks = [
      { _id: "task1", categories: [{ _id: "category123", title: "Category 1" }] },
      { _id: "task2", categories: [{ _id: "category123", title: "Category 1" }] },
    ];
    Category.findOneAndDelete.mockResolvedValue(deletedCategory);
    Task.find.mockResolvedValue(foundTasks);
    Task.findOneAndUpdate.mockResolvedValue();
  
    req.params.id = "category123";
    await deleteCategory(req, result);
  
    expect(Category.findOneAndDelete).toHaveBeenCalledWith({ _id: "category123" });
    expect(Task.find).toHaveBeenCalledWith({
      categories: { $elemMatch: { _id: "category123" } },
    });
    expect(Task.findOneAndUpdate).toHaveBeenCalledTimes(2);
    expect(result.json).toHaveBeenCalledWith(deletedCategory);
  });
});

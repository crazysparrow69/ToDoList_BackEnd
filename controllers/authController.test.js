const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const { handleAuth, getMe } = require("./authController");

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
}));
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("express-validator");

describe("handleAuth", () => {
  let result;
  let req;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    result = {
      status: jest.fn(() => result),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 400 if validation errors exist", async () => {
    const errors = {
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => ["Error 1", "Error 2"]),
    };
    validationResult.mockReturnValue(errors);

    await handleAuth(req, result);

    expect(validationResult).toHaveBeenCalledWith(req);
    expect(result.status).toHaveBeenCalledWith(400);
    expect(result.json).toHaveBeenCalledWith({
      message: "Incorrect data",
      errors: ["Error 1", "Error 2"],
    });
  });

  test("should return 404 if user is not found", async () => {
    const errors = {
      isEmpty: jest.fn(() => true),
    };
    const user = null;
    validationResult.mockReturnValue(errors);
    User.findOne.mockResolvedValue(user);

    await handleAuth(req, result);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(result.status).toHaveBeenCalledWith(404);
    expect(result.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  test("should return 404 if password is invalid", async () => {
    const errors = {
      isEmpty: jest.fn(() => true),
    };
    const user = {
      password: "hashed_password",
    };
    validationResult.mockReturnValue(errors);
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);

    await handleAuth(req, result);

    expect(bcrypt.compare).toHaveBeenCalledWith(
      req.body.password,
      user.password
    );
    expect(result.status).toHaveBeenCalledWith(404);
    expect(result.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  test("should return user data and token if authentication is successful", async () => {
    const errors = {
      isEmpty: jest.fn(() => true),
    };
    const user = {
      _id: "user_id",
      _doc: {
        email: req.body.email,
        name: "Test User",
        password: "hashed_password",
      },
    };
    const token = "token123";
    validationResult.mockReturnValue(errors);
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue(token);

    await handleAuth(req, result);

    expect(bcrypt.compare).toHaveBeenCalledWith(
      req.body.password,
      user.password
    );
    expect(jwt.sign).toHaveBeenCalledWith({ _id: user._id }, "secret123", {
      expiresIn: "30d",
    });
    expect(result.json).toHaveBeenCalledWith({
      email: req.body.email,
      name: "Test User",
      token: token,
    });
  });
});


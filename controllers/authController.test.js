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
});


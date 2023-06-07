const { verifyPass } = require('./passwordController');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Mock the required modules
jest.mock('../models/User');
jest.mock('express-validator');
jest.mock('bcrypt');

describe('passwordController', () => {
  // Mock request and response objects
  let req;
  let res;

  beforeEach(() => {
    req = {
      userId: 'user123',
      body: {
        password: 'password123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyPass', () => {
    test('should return "Success" if the password is valid', async () => {
      const validationResultMock = {
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      };

      const userMock = {
        _id: 'user123',
        password: await bcrypt.hash('password123', 10), // Hash the password for comparison
      };

      validationResult.mockReturnValue(validationResultMock);
      User.findOne.mockResolvedValue(userMock);
      bcrypt.compare.mockResolvedValue(true);

      await verifyPass(req, res);

      expect(validationResult).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ _id: req.userId });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        userMock.password
      );
      expect(res.json).toHaveBeenCalledWith({ message: 'Success' });
    });

    test('should return a 404 status code and "User not found" message if the user is not found', async () => {
      const validationResultMock = {
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      };
    
      validationResult.mockReturnValue(validationResultMock);
      User.findOne.mockResolvedValue(null);
  
      await verifyPass(req, res);
    
      expect(validationResult).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ _id: req.userId });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });
});
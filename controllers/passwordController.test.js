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
  let result;

  beforeEach(() => {
    req = {
      userId: 'user123',
      body: {
        password: 'password123',
      },
    };

    result = {
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

      await verifyPass(req, result);

      expect(validationResult).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ _id: req.userId });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        userMock.password
      );
      expect(result.json).toHaveBeenCalledWith({ message: 'Success' });
    });

    test('should return a 404 status code and "User not found" message if the user is not found', async () => {
      const validationResultMock = {
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      };
    
      validationResult.mockReturnValue(validationResultMock);
      User.findOne.mockResolvedValue(null);
  
      await verifyPass(req, result);
    
      expect(validationResult).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ _id: req.userId });
      expect(result.status).toHaveBeenCalledWith(404);
      expect(result.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    test('should return a 404 status code and "Invalid password" message if the password is invalid', async () => {
      const validationResultMock = {
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      };
  
      const userMock = {
        _id: 'user123',
        password: await bcrypt.hash('password456', 10), // Hash a different password
      };
  
      validationResult.mockReturnValue(validationResultMock);
      User.findOne.mockResolvedValue(userMock);
      bcrypt.compare.mockResolvedValue(false);
  
      await verifyPass(req, result);
  
      expect(validationResult).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ _id: req.userId });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        userMock.password
      );
      expect(result.status).toHaveBeenCalledWith(404);
      expect(result.json).toHaveBeenCalledWith({ message: 'Invalid password' });
    });

    test('should return a 400 status code and validation errors if there are validation errors', async () => {
      const validationResultMock = {
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue(['Invalid data']),
      };
  
      validationResult.mockReturnValue(validationResultMock);
      await verifyPass(req, result);
  
      expect(validationResult).toHaveBeenCalled();
      expect(result.status).toHaveBeenCalledWith(400);
      expect(result.json).toHaveBeenCalledWith({
        message: 'Incorrect data',
        errors: ['Invalid data'],
      });
    });

    it('should return a 500 status code and "Internal server error" message if an error occurs', async () => {
      const validationResultMock = {
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      };

      validationResult.mockReturnValue(validationResultMock);
      User.findOne.mockRejectedValue(new Error('Some error'));
  
      await verifyPass(req, result);
  
      expect(validationResult).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ _id: req.userId });
      expect(result.status).toHaveBeenCalledWith(500);
      expect(result.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });
});
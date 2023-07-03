const {
  getOneUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('./userController');
const User = require('../models/User');
  
jest.mock('../models/User'); // Mocking the User model
  
describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });
  
  describe('getOneUser', () => {
    let req, result;
  
    beforeEach(() => {
      req = {
        params: {
          id: 'user_id', // Replace with an existing user ID for testing
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
  
    it('should return user data if user exists', async () => {
      const expectedUserData = {
        name: 'John Doe',
        email: 'john@example.com',
        // Add other expected user properties here
      };
  
      const user = {
        _id: req.params.id,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        // Add other user properties here
      };
  
      User.findOne = jest.fn().mockResolvedValueOnce(user);
  
      await getOneUser(req, result);
  
      expect(User.findOne).toHaveBeenCalledWith({ _id: req.params.id });
    });
  
    it('should return 404 if user does not exist', async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(null);
  
      await getOneUser(req, result);
  
      expect(User.findOne).toHaveBeenCalledWith({ _id: req.params.id });
      expect(result.status).toHaveBeenCalledWith(404);
      expect(result.json).toHaveBeenCalledWith({ message: 'Could not find' });
    });
  });
  
  describe('getAllUsers', () => {
    test('should return all users', async () => {
      const mockUsers = [
        { _id: '123', email: 'test1@example.com', username: 'user1' },
        { _id: '456', email: 'test2@example.com', username: 'user2' },
      ];
      const req = {};
      const result = {
        json: jest.fn().mockReturnValueOnce(mockUsers),
      };
  
      User.find.mockResolvedValueOnce(mockUsers);
  
      await getAllUsers(req, result);
  
      expect(User.find).toHaveBeenCalled();
      expect(result.json).toHaveBeenCalledWith(mockUsers);
    });
  
    test('should return 500 if an error occurs', async () => {
      const req = {};
      const result = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      User.find.mockRejectedValueOnce(new Error('Database error'));
  
      await getAllUsers(req, result);
  
      expect(User.find).toHaveBeenCalled();
      expect(result.status).toHaveBeenCalledWith(500);
      expect(result.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });
  
  describe('createUser', () => {
    test('should return 400 if user already exists', async () => {
      const req = {
        body: { email: 'test@example.com' },
      };
      const result = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      User.findOne.mockResolvedValueOnce({ email: 'test@example.com' });
  
      await createUser(req, result);
  
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result.status).toHaveBeenCalledWith(400);
      expect(result.json).toHaveBeenCalledWith({
        message: 'You already have account',
      });
    });
  
    test('should return 500 if an error occurs', async () => {
      const req = {
        body: { email: 'test@example.com' },
      };
      const result = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      User.findOne.mockRejectedValueOnce(new Error('Database error'));
  
      await createUser(req, result);
  
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result.status).toHaveBeenCalledWith(500);
      expect(result.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });

  describe('updateUser', () => {
    test('should return 404 when user is not found', async () => {
      User.findOneAndUpdate.mockResolvedValue(null);
  
      const req = {
        params: { id: '123' },
        body: { username: 'newUsername' },
      };
      const result = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      await updateUser(req, result);
  
      expect(User.findOneAndUpdate).toHaveBeenCalledWith({ _id: '123' }, { username: 'newUsername' });
      expect(result.status).toHaveBeenCalledWith(404);
      expect(result.json).toHaveBeenCalledWith({ message: 'Could not find the user' });
    });
  
    test('should return 500 when an error occurs', async () => {
      const req = {
        params: { id: '123' },
        body: { username: 'newUsername' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const error = new Error('Database error');
      User.findOneAndUpdate.mockRejectedValue(error);
  
      await updateUser(req, res);
  
      expect(User.findOneAndUpdate).toHaveBeenCalledWith({ _id: '123' }, { username: 'newUsername' });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('deleteUser', () => {
    test('should delete user', async () => {
      const req = {
        params: { id: '123' },
      };
      const result = {
        json: jest.fn(),
      };
  
      const mockUser = { _id: '123' };
  
      User.findOneAndDelete.mockResolvedValueOnce(mockUser);
  
      await deleteUser(req, result);
  
      expect(User.findOneAndDelete).toHaveBeenCalledWith({ _id: '123' });
      expect(result.json).toHaveBeenCalledWith({ message: 'Success' });
    });
  
    test('should return 404 if user is not found', async () => {
      const req = {
        params: { id: '123' },
      };
      const result = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      User.findOneAndDelete.mockResolvedValueOnce(null);
  
      await deleteUser(req, result);
  
      expect(User.findOneAndDelete).toHaveBeenCalledWith({ _id: '123' });
      expect(result.status).toHaveBeenCalledWith(404);
      expect(result.json).toHaveBeenCalledWith({ message: 'Could not find' });
    });
  
    test('should return 500 if an error occurs', async () => {
      const req = {
        params: { id: '123' },
      };
      const result = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      User.findOneAndDelete.mockRejectedValueOnce(new Error('Database error'));
  
      await deleteUser(req, result);
  
      expect(User.findOneAndDelete).toHaveBeenCalledWith({ _id: '123' });
      expect(result.status).toHaveBeenCalledWith(500);
      expect(result.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });
});
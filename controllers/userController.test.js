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
    test('should return user data for a valid user ID', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
      };
      const req = { params: { id: '123' } };
  
      User.findOne.mockResolvedValueOnce(mockUser);
  
      await getOneUser(req, result);
  
      expect(User.findOne).toHaveBeenCalledWith({ _id: '123' });
    });
  
    test('should return 404 if user is not found', async () => {
      const req = { params: { id: '123' } };
      const result = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      User.findOne.mockResolvedValueOnce(null);
  
      await getOneUser(req, result);
  
      expect(User.findOne).toHaveBeenCalledWith({ _id: '123' });
      expect(result.status).toHaveBeenCalledWith(404);
      expect(result.json).toHaveBeenCalledWith({ message: 'Could not find' });
    });
  
    test('should return 500 if an error occurs', async () => {
      const req = { params: { id: '123' } };
      const result = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      User.findOne.mockRejectedValueOnce(new Error('Database error'));
  
      await getOneUser(req, result);
  
      expect(User.findOne).toHaveBeenCalledWith({ _id: '123' });
      expect(result.status).toHaveBeenCalledWith(500);
       expect(result.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
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
    test('should update user data', async () => {
      const req = {
        params: { id: '123' },
        body: {
          username: 'newusername',
          password: 'newpassword',
          email: 'newemail@example.com',
        },
      };
      const result = {
        json: jest.fn(),
      };
  
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
        _doc: {
          email: 'test@example.com',
          username: 'testuser',
        },
      };
  
      const mockUpdatedUser = {
        ...mockUser,
        username: 'newusername',
        password: 'newhashedPassword',
        email: 'newemail@example.com',
      };
  
      User.findOne.mockResolvedValueOnce(mockUser);
      User.findOneAndUpdate.mockResolvedValueOnce(mockUpdatedUser);
  
      await updateUser(req, result);
  
      expect(User.findOne).toHaveBeenCalledWith({ email: '123' });
    });
  
    test('should return 404 if user is not found', async () => {
      const req = {
        params: { id: '123' },
        body: {
          username: 'newusername',
          password: 'newpassword',
          email: 'newemail@example.com',
        },
      };
      const result = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      User.findOne.mockResolvedValueOnce(null);
  
      await updateUser(req, result);
  
      expect(User.findOne).toHaveBeenCalledWith({ email: '123' });
      expect(result.status).toHaveBeenCalledWith(404);
      expect(result.json).toHaveBeenCalledWith({ message: 'Could not find' });
    });
  
    test('should return 500 if an error occurs', async () => {
      const req = {
        params: { id: '123' },
        body: {
          username: 'newusername',
          password: 'newpassword',
          email: 'newemail@example.com',
        },
      };
      const result = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      User.findOne.mockRejectedValueOnce(new Error('Database error'));
  
      await updateUser(req, result);
  
      expect(User.findOne).toHaveBeenCalledWith({ email: '123' });
      expect(result.status).toHaveBeenCalledWith(500);
      expect(result.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
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
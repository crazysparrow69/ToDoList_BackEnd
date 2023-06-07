const {
    createTask,
    getAllTasks,
    getTask,
    deleteTask,
  updateTask,
  shareTask,
} = require('./taskController');
  
const { validationResult } = require('express-validator');
const Task = require('../models/Task');
  
jest.mock('express-validator');
jest.mock('../models/Task');
  
describe('Task Controller', () => {
  let req;
  let result;
  
  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
      userId: 'user123',
    };
  
    result = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createTask', () => {
    test('should return an error if an internal server error occurs', async () => {
      const error = new Error('Internal server error');
  
      Task.mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(error),
      });
  
      await createTask(req, result);
  
      expect(validationResult).toHaveBeenCalledWith(req);
      expect(result.status).toHaveBeenCalledWith(500);
      expect(result.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });
  
  describe('getAllTasks', () => {
    test('should return all tasks with default parameters', async () => {
      const count = 3;
      const tasks = [{ _id: 'task1' }, { _id: 'task2' }, { _id: 'task3' }];
      const totalPages = 1;
      const currentPage = 1;

      Task.countDocuments.mockResolvedValueOnce(count);
      Task.find.mockReturnValueOnce({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(tasks),
      });
  
      await getAllTasks(req, result);
  
      expect(Task.countDocuments).toHaveBeenCalledWith({
        user: req.userId,
      });
      expect(Task.find).toHaveBeenCalledWith({
        user: req.userId,
      });
      expect(result.json).toHaveBeenCalledWith({
        tasks,
        totalPages,
        currentPage,
      });
    });
  });

  describe('getTask', () => {
    test('should get a specific task', async () => {
      const taskId = 'task123';
      req.params.id = taskId;
  
      const foundTask = { _id: taskId, title: 'Task 1' };
      Task.findOne.mockResolvedValueOnce(foundTask);
  
      await getTask(req, result);
  
      expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
      expect(result.json).toHaveBeenCalledWith(foundTask);
    });
  
    test('should return an error if ID is missing', async () => {
      await getTask(req, result);
  
      expect(result.status).toHaveBeenCalledWith(400);
      expect(result.json).toHaveBeenCalledWith({ message: 'Id required' });
    });
  
    test('should return an error if the task is not found', async () => {
      const taskId = 'task123';
      req.params.id = taskId;
  
      Task.findOne.mockResolvedValueOnce(null);
  
      await getTask(req, result);
  
      expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
      expect(result.status).toHaveBeenCalledWith(404);
      expect(result.json).toHaveBeenCalledWith({ message: 'Could not find the task' });
    });
  
    // Add more test cases for other scenarios
  });
  
  describe('deleteTask', () => {
    test('should delete a specific task', async () => {
      const taskId = 'task123';
      req.params.id = taskId;
  
      const deletedTask = { _id: taskId, title: 'Task 1' };
      Task.findOneAndDelete.mockResolvedValueOnce(deletedTask);
  
      await deleteTask(req, result);
  
      expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: taskId });
      expect(result.json).toHaveBeenCalledWith(deletedTask);
    });
  
    test('should return an error if ID is missing', async () => {
      await deleteTask(req, result);
  
      expect(result.status).toHaveBeenCalledWith(400);
      expect(result.json).toHaveBeenCalledWith({ message: 'Id required' });
    });
  
    test('should return an error if the task is not found', async () => {
      const taskId = 'task123';
      req.params.id = taskId;
  
      Task.findOneAndDelete.mockResolvedValueOnce(null);
  
      await deleteTask(req, result);
  
      expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: taskId });
      expect(result.status).toHaveBeenCalledWith(404);
      expect(result.json).toHaveBeenCalledWith({ message: 'Could not find the task' });
    });
  
    // Add more test cases for other scenarios
  });
  
  describe('updateTask', () => {
    test('should return an error if ID is missing', async () => {
      await updateTask(req, result);
  
      expect(result.status).toHaveBeenCalledWith(400);
      expect(result.json).toHaveBeenCalledWith({ message: 'Id required' });
    });
  });
  
  describe('shareTask', () => {
    test('should return an error if ID is missing', async () => {
      await shareTask(req, result);
  
      expect(result.status).toHaveBeenCalledWith(400);
      expect(result.json).toHaveBeenCalledWith({ message: 'Id required' });
    });
  });
});
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
  let res;
  
  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
      userId: 'user123',
    };
  
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createTask', () => {
    it('should return an error if an internal server error occurs', async () => {
      const error = new Error('Internal server error');
  
      Task.mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(error),
      });
  
      await createTask(req, res);
  
      expect(validationResult).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });
  
  describe('getAllTasks', () => {
    it('should return all tasks with default parameters', async () => {
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
  
      await getAllTasks(req, res);
  
      expect(Task.countDocuments).toHaveBeenCalledWith({
        user: req.userId,
      });
      expect(Task.find).toHaveBeenCalledWith({
        user: req.userId,
      });
      expect(res.json).toHaveBeenCalledWith({
        tasks,
        totalPages,
        currentPage,
      });
    });
  });

  describe('getTask', () => {
    it('should get a specific task', async () => {
      const taskId = 'task123';
      req.params.id = taskId;
  
      const foundTask = { _id: taskId, title: 'Task 1' };
      Task.findOne.mockResolvedValueOnce(foundTask);
  
      await getTask(req, res);
  
      expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
      expect(res.json).toHaveBeenCalledWith(foundTask);
    });
  
    it('should return an error if ID is missing', async () => {
      await getTask(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Id required' });
    });
  
    it('should return an error if the task is not found', async () => {
      const taskId = 'task123';
      req.params.id = taskId;
  
      Task.findOne.mockResolvedValueOnce(null);
  
      await getTask(req, res);
  
      expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Could not find the task' });
    });
  
    // Add more test cases for other scenarios
  });
  
  describe('deleteTask', () => {
    it('should delete a specific task', async () => {
      const taskId = 'task123';
      req.params.id = taskId;
  
      const deletedTask = { _id: taskId, title: 'Task 1' };
      Task.findOneAndDelete.mockResolvedValueOnce(deletedTask);
  
      await deleteTask(req, res);
  
      expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: taskId });
      expect(res.json).toHaveBeenCalledWith(deletedTask);
    });
  
    it('should return an error if ID is missing', async () => {
      await deleteTask(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Id required' });
    });
  
    it('should return an error if the task is not found', async () => {
      const taskId = 'task123';
      req.params.id = taskId;
  
      Task.findOneAndDelete.mockResolvedValueOnce(null);
  
      await deleteTask(req, res);
  
      expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: taskId });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Could not find the task' });
    });
  
    // Add more test cases for other scenarios
  });
  
  describe('updateTask', () => {
    it('should return an error if ID is missing', async () => {
      await updateTask(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Id required' });
    });
  });
  
  describe('shareTask', () => {
    it('should return an error if ID is missing', async () => {
      await shareTask(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Id required' });
    });
  });
});
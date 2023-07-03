const imageController = require('./imageController');
const Image = require('../models/Image');

jest.mock('../models/Image', () => ({
  find: jest.fn(),
  findOneAndDelete: jest.fn(),
  create: jest.fn(),
}));

const req = {
  body: {
    image: 'test-image',
  },
  userId: 'test-userId',
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('saveImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should save a new image successfully', async () => {
    Image.find.mockResolvedValue(null);
    Image.create.mockResolvedValue({ image: 'test-image' });

    await imageController.saveImage(req, res);

    expect(Image.find).toHaveBeenCalledWith({ userId: 'test-userId' });
    expect(Image.findOneAndDelete).not.toHaveBeenCalled();
    expect(Image.create).toHaveBeenCalledWith({
      image: 'test-image',
      userId: 'test-userId',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ url: 'test-image' });
  });

  test('should replace existing image and save a new one', async () => {
    Image.find.mockResolvedValue({ image: 'existing-image' });
    Image.create.mockResolvedValue({ image: 'test-image' });

    await imageController.saveImage(req, res);

    expect(Image.find).toHaveBeenCalledWith({ userId: 'test-userId' });
    expect(Image.findOneAndDelete).toHaveBeenCalledWith({ userId: 'test-userId' });
    expect(Image.create).toHaveBeenCalledWith({
      image: 'test-image',
      userId: 'test-userId',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ url: 'test-image' });
  });

  test('should handle errors', async () => {
    Image.find.mockRejectedValue(new Error('Test error'));

    await imageController.saveImage(req, res);

    expect(Image.find).toHaveBeenCalledWith({ userId: 'test-userId' });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
  });
});

describe('getImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get an image successfully', async () => {
    Image.find.mockResolvedValue({ image: 'test-image' });

    await imageController.getImage(req, res);

    expect(Image.find).toHaveBeenCalledWith({ userId: 'test-userId' });
    expect(res.json).toHaveBeenCalledWith({ image: 'test-image' });
  });

  test('should handle image not found', async () => {
    Image.find.mockResolvedValue(null);

    await imageController.getImage(req, res);

    expect(Image.find).toHaveBeenCalledWith({ userId: 'test-userId' });
    expect(res.status).toHaveBeenCalledWith(500);
  });
  
  test('should handle errors', async () => {
    Image.find.mockRejectedValue(new Error('Test error'));

    await imageController.getImage(req, res);

    expect(Image.find).toHaveBeenCalledWith({ userId: 'test-userId' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
  });
});

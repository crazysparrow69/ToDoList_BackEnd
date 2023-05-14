const Image = require("../models/Image");

const saveImage = async (req, res) => {
  const image = req.body.image;
  try {
    const foundImage = await Image.find({ userId: req.userId });
    if (foundImage) {
      await Image.findOneAndDelete({ userId: req.userId });
    }

    const createdImage = await Image.create({
      image: image,
      userId: req.userId
    });

    res.status(201).json({ message: "Image created" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

const getImage = async (req, res) => {
  try {
    const foundImage = await Image.find({ userId: req.userId });

    res.json(foundImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  saveImage,
  getImage
};
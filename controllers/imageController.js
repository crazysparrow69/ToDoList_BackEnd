const Image = require("../models/Image");

const saveImage = async (req, res) => {
  const image = req.body.image;
  try {
    const foundImage = await Image.find({ userId: req.user._id.toString() });
    if (foundImage) {
      await Image.findOneAndDelete({ userId: req.user._id.toString() });
    }

    const createdImage = await Image.create({
      image: image,
      userId: req.req.user._id.toString()
    });

    res.status(201).json({ url: createdImage.image });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

const getImage = async (req, res) => {
  try {
    const foundImage = await Image.find({ userId: req.user._id.toString() });

    if (foundImage.length === 0) {
      const defaultImage = await Image.find({ _id: "6480c5db63c613be4a72be18"});
      return defaultImage ? res.json(defaultImage) : res.sendStatus(204);
    }

    res.json(foundImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  saveImage,
  getImage
};
const { Router } = require("express");
const Image = require("../models/image");
const { upload } = require("../middleware/imageUpload");
const imageRouter = Router();

// image upload API
imageRouter.post("/images", upload.single("imageTest"), async (req, res) => {
  const image = await new Image({
    key: req.file.filename,
    originalFileName: req.file.originalname,
  }).save();
  res.json(image);
});

// image get API
imageRouter.get("/images", async (req, res) => {
  const images = await Image.find();
  res.json(images);
});

module.exports = { imageRouter };

const { Router } = require("express");
const Image = require("../models/image");
const { upload } = require("../middleware/imageUpload");
const imageRouter = Router();

// image upload API
imageRouter.post("/", upload.single("imageTest"), async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("권한 없음! 로그인 후 이미지를 업로드 해주세요!");
    }

    const image = await new Image({
      user: {
        _id: req.user.id,
        name: req.user.name,
        userId: req.user.userId,
      },
      key: req.file.filename,
      originalFileName: req.file.originalname,
    }).save();
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

// image get API
imageRouter.get("/", async (req, res) => {
  const images = await Image.find();
  res.json(images);
});

module.exports = { imageRouter };

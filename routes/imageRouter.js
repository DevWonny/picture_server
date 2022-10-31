const { Router } = require("express");
const Image = require("../models/image");
const { upload } = require("../middleware/imageUpload");
const imageRouter = Router();
const fs = require("fs");
const { promisify } = require("util");
const mongoose = require("mongoose");

const fileUnlink = promisify(fs.unlink);

// image upload API
imageRouter.post("/", upload.single("image"), async (req, res) => {
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
      text: req.body.text,
    }).save();
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

// image get API
imageRouter.get("/", async (req, res) => {
  const { lastId } = req.query;

  if (lastId && !mongoose.isValidObjectId(lastId))
    throw new Error("lastId가 없습니다!");
  const images = await Image.find(
    lastId && {
      _id: { $lt: lastId },
    }
  )
    .sort({ _id: -1 })
    .limit(12);

  res.json(images);
});

// image detail get API
imageRouter.get("/:imageId", async (req, res) => {
  const image = await Image.findOne({ _id: req.params.imageId });
  res.json(image);
});

// image delete API
// 1. uploads 폴더에 있는 사진 데이터 삭제
// 2. DB에 있는 image 문서 삭제
imageRouter.delete("/:imageId", async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("권한이 없습니다! 로그인 후 삭제해주세요!");
    }

    if (!mongoose.isValidObjectId(req.params.imageId)) {
      throw new Error("올바르지 않은 이미지 아이디입니다!");
    }

    const image = await Image.findOneAndDelete({ _id: req.params.imageId });

    if (!image) {
      return res.json({ message: "이미 삭제된 이미지입니다!" });
    }

    await fileUnlink(`./uploads/${image.key}`);

    res.json({ message: "image delete!", image });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { imageRouter };

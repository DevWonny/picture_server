require("dotenv").config();
const express = require("express");
const multer = require("multer");
// 파일 이름 - 랜덤으로 생성
const { v4: uuid } = require("uuid");
// 파일 형식
const mime = require("mime-types");
// mongoose
const mongoose = require("mongoose");
const Image = require("./models/image");

// multer.diskStorage -> 파일 저장 과정을 제어할 수 있게 됨.
// cb의 첫번째 인자에 오류 객체를 입력하면 파일 저장을 차단하고 오류 처리를 하면됨.
const storage = multer.diskStorage({
  // 어디에 저장을 할 지
  destination: (req, file, cb) => cb(null, "./uploads"),
  // 어떠한 이름으로 저장할 지
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Type 제한
    if (["image/jpeg", "image/png"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid File Type"), false);
    }
  },
  // file size 제한
  limits: {
    // 1MB -> 1024  * 1024
    // 5MB
    fileSize: 1024 * 1024 * 5,
  },
});

const { MONGO_URI, PORT } = process.env;

const app = express();

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected!");
    app.use("/uploads", express.static("uploads"));

    // image upload API
    app.post("/images", upload.single("imageTest"), async (req, res) => {
      const image = await new Image({
        key: req.file.filename,
        originalFileName: req.file.originalname,
      }).save();
      res.json(image);
    });

    // image get API
    app.get("/images", async (req, res) => {
      const images = await Image.find();
      res.json(images);
    });

    app.listen(PORT, () =>
      console.log("Express Server listening on Port" + PORT)
    );
  })
  .catch((err) => console.log(err));

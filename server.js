const express = require("express");
const multer = require("multer");
// 파일 이름 - 랜덤으로 생성
const { v4: uuid } = require("uuid");
// 파일 형식
const mime = require("mime-types");

// multer.diskStorage -> 파일 저장 과정을 제어할 수 있게 됨.
// cb의 첫번째 인자에 오류 객체를 입력하면 파일 저장을 차단하고 오류 처리를 하면됨.
const storage = multer.diskStorage({
  // 어디에 저장을 할 지
  destination: (req, file, cb) => cb(null, "./uploads"),
  // 어떠한 이름으로 저장할 지
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});

const upload = multer({ storage });

const app = express();
const PORT = 5000;

app.post("/upload", upload.single("imageTest"), (req, res) => {
  console.log(req.file);
  res.json(req.file);
});

app.listen(PORT, () => console.log("Express Server listening on Port" + PORT));

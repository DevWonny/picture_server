const { Router } = require("express");
const userRouter = Router();
const User = require("../models/user");
// password 암호화 작업
const { hash } = require("bcryptjs");

userRouter.post("/register", async (req, res) => {
  try {
    // password가 6자리 이하일 경우
    if (req.body.password.length < 6) {
      throw new Error("비밀번호를 6자 이상 입력해주세요!");
    }
    // id가 3자리 이하인 경우
    if (req.body.id.length < 3) {
      throw new Error("아이디를 3자 이상 입력해주세요!");
    }
    // password 암호화
    const hashedPassword = await hash(req.body.password, 10);
    await new User({
      name: req.body.name,
      id: req.body.id,
      hashedPassword,
    }).save();
    res.json({ message: "user register!!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };

const { Router } = require("express");
const userRouter = Router();
const User = require("../models/user");
// password 암호화 작업
const { hash, compare } = require("bcryptjs");
const mongoose = require("mongoose");

// register
userRouter.post("/register", async (req, res) => {
  try {
    // password가 6자리 이하일 경우
    if (req.body.password.length < 6) {
      throw new Error("비밀번호를 6자 이상 입력해주세요!");
    }
    // id가 3자리 이하인 경우
    if (req.body.userId.length < 3) {
      throw new Error("아이디를 3자 이상 입력해주세요!");
    }
    // password 암호화
    const hashedPassword = await hash(req.body.password, 10);
    const user = await new User({
      name: req.body.name,
      userId: req.body.userId,
      hashedPassword,
      sessions: [{ createAt: new Date() }],
    }).save();

    const session = user.sessions[0];

    res.json({
      message: "user register!!",
      sessionId: session._id,
      name: user.name,
    });
  } catch (err) {
    console.log(req.body);
    res.status(400).json({ message: err.message });
  }
});

// login
userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.body.userId });
    const isValid = await compare(req.body.password, user.hashedPassword);

    if (!isValid) {
      throw new Error("비밀번호가 맞지 않습니다!");
    }

    // session 추가
    user.sessions.push({ createAt: new Date() });
    // 가장 최신 session
    const session = user.sessions[user.sessions.length - 1];
    user.save();
    res.json({
      message: "user Login!",
      sessionId: session._id,
      name: user.name,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// logout
// 로그인 시 header에 sessionId를 넣고
userRouter.patch("/logout", async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("로그인되지 않은 유저입니다.");
    }

    await User.updateOne(
      { _id: req.user.id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    );

    res.json({ message: "user Logout!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };

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
  const user = await User.findOne({ userId: req.body.userId });
  try {
    // const user = await User.findOne({ userId: req.body.userId });
    const isPassword = await compare(req.body.password, user.hashedPassword);

    // password check
    if (!isPassword) {
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
    if (!user) {
      res
        .status(400)
        .json({ message: "회원정보가 없습니다. 회원가입을 해주세요." });
      return;
    }
    res.status(400).json({ message: err.message });
  }
});

// logout
userRouter.post("/logout", async (req, res) => {
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

// user information get\
// user의 정보 가져오기
// 추후 profile image도 fetch 필요
// 추후 introduction도 fetch 필요
userRouter.post("/user", async (req, res) => {
  const user = await User.findOne({ sessionid: req.body.sessionid });
  try {
    res.json({
      message: "user DataFetch Success!",
      name: user.name,
      id: user.userId,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// user edit
userRouter.post("/edit", async (req, res) => {
  const user = await User.findOnw({ sessionid: req.body.sessionid });
  try {
    res.json({
      message: "user Data Edit Success!",
      user: user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };

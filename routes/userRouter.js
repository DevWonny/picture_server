const { Router } = require("express");
const userRouter = Router();
const User = require("../models/user");

userRouter.post("/register", async (req, res) => {
  console.log(req.body);
  await new User(req.body).save();
  res.json({ message: "user register!!" });
});

module.exports = { userRouter };

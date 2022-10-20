const { Router } = require("express");
const userRouter = Router();

userRouter.post("/register", (req, res) => {
  console.log("req.body");
  res.json({ message: "user register!!" });
});

module.exports = { userRouter };

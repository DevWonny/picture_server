require("dotenv").config();
const express = require("express");
const cors = require("cors");
// mongoose
const mongoose = require("mongoose");
const { imageRouter } = require("./routes/imageRouter");
const { userRouter } = require("./routes/userRouter");
const { authentication } = require("./middleware/authentication");

const { MONGO_URI, PORT } = process.env;

const app = express();

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected!");
    app.use(cors({ origin: "*" }));
    app.use("/uploads", express.static("uploads"));
    // request를 받아서 해당 request에 json형식 데이터가 있다면 json방식으로 변환해중
    app.use(express.json());
    // authentication
    app.use(authentication);
    // image router
    app.use("/images", imageRouter);
    // user router
    app.use("/user", userRouter);

    app.listen(PORT, () =>
      console.log("Express Server listening on Port" + PORT)
    );
  })
  .catch((err) => console.log(err));

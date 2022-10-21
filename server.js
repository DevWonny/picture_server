require("dotenv").config();
const express = require("express");

// mongoose
const mongoose = require("mongoose");
const { imageRouter } = require("./routes/imageRouter");

const { MONGO_URI, PORT } = process.env;

const app = express();

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected!");
    app.use("/uploads", express.static("uploads"));

    app.use("/images", imageRouter);

    app.listen(PORT, () =>
      console.log("Express Server listening on Port" + PORT)
    );
  })
  .catch((err) => console.log(err));

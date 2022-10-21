const mongoose = require("mongoose");

// id, name, password, introduce
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    id: { type: String, required: true },
    password: { type: String, required: true },
    introduce: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", UserSchema);

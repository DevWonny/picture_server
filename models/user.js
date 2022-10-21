const mongoose = require("mongoose");

// id, name, password, introduce
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // unique -> 같은 아이디 방지
    id: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    // password: { type: String, required: true },
    introduce: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", UserSchema);

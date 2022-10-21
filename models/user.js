const mongoose = require("mongoose");

// id, name, password, introduce
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // unique -> 같은 아이디 방지
    userId: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    // password: { type: String, required: true },
    introduce: { type: String, required: false },

    // session id -> _id를 활용
    // _id는 default로 자동 생성됨!
    sessions: [
      {
        createAt: { type: Date, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", UserSchema);

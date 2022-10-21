const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String, required: true },
      userId: { type: String, required: true },
    },
    key: { type: String, required: true },
    originalFileName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("image", ImageSchema);

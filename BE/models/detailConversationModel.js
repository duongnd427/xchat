const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, require: true },
    type: { type: String, require: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const DetailConverchema = new Schema(
  {
    msg: [MessageSchema],
    owner: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DetailConversation", DetailConverchema);

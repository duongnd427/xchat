const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Conversation = new Schema(
  {
    partner: { type: Schema.Types.ObjectId, ref: "User" },
    last_msg: { type: String },
  },
  {
    timestamps: true,
  }
);

const ListConverSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    conversation: [Conversation],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ListConversation", ListConverSchema);

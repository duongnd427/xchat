const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userid: { type: Number, require: true, unique: true },
    username: { type: String, required: true },
    hashpw: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);

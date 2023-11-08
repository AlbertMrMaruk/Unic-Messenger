const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accounts: Array,
  chats: { default: [] },
  allSize: Number,
  chatsCount: Number,
});

mongoose.model("users", userSchema);

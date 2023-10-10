const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  username: String,
  accounts: Array,
  chats: Array,
  allSize: Number,
});

mongoose.model("users", userSchema);

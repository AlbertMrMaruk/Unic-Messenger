const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  accounts: Array,
  chats: String,
});

mongoose.model("users", userSchema);

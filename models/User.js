const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  accounts: Array,
  chats: Array,
});

mongoose.model("users", userSchema);

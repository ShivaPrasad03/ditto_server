const mongoose = require("mongoose");

const User = mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,

    unique: true,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("user", User);

const mngoose = require('mongoose');

const userSchema = new mngoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }, 
  isVerified: {
    type: Boolean,
    default: false  
    },
});

module.exports = mngoose.model("User", userSchema);
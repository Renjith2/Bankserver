const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  surName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  tempAddress: {
    type: String,
    required: true,
  },
  permanentAddress: {
    type: String,
    required: true,
  },
  panDetails: {
    type: String,
    required: true,
  },
  aadhaarDetails: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);

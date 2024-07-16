const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  serviceId: {
    type: String,
    required: true,
  },
  requestType: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Service", serviceSchema);

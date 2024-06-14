// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  categories: {
    type: [String],
    required: true
  },
  fileUrl: {
    type: String,
    required: true,
    get: function (fileUrl) {
      console.log("fileUrl: " + fileUrl);
      return fileUrl;
    }
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Reference to the User model
    }
  ]
}, {
  toJSON: { getters: true }
}
);

module.exports = mongoose.model('Image', imageSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
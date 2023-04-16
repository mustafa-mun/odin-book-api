const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  post_img: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'PostLike'
  }]
});

module.exports = mongoose.model("Post", PostSchema);

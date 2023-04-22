const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// COMMENT MODEL
const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "CommentLike",
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  like_count: { type: Number, default:0 }
});

module.exports = mongoose.model("Comment", CommentSchema);

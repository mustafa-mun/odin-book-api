const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// COMMENT LIKE MODEL
const CommentLikeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  liked_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommentLike", CommentLikeSchema);

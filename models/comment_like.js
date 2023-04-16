const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentLikeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  post: { type: Schema.Types.ObjectId, required: true },
  liked_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommentLike", CommentLikeSchema);

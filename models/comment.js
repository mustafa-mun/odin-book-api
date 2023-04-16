const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// COMMENT MODEL
const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "CommentLike",
    },
  ],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);

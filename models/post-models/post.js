const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// POST MODEL
const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  post_img: { type: String, default: "#" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "PostLike",
    },
  ],
  like_count: { type: Number, default: 0 }
});

module.exports = mongoose.model("Post", PostSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// FRIEND REQUEST MODEL
const FriendRequestSchema = new Schema({
  from_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  to_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now },
  is_accepted: { type: Boolean, default: false },
});

module.exports = mongoose.model("FriendRequest", FriendRequestSchema);

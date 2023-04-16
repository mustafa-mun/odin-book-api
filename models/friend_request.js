const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema({
  from_user: { type: Schema.Types.ObjectId, required: true },
  to_user: { type: Schema.Types.ObjectId, required: true },
  created_at: { type: Date, default: Date.now },
  is_accepted: { type: Boolean, default: false },
});

module.exports = mongoose.model("FriendRequest", FriendRequestSchema);
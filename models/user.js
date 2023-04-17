const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// USER MODEL
const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  profile: { type: Schema.Types.ObjectId },
  is_admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);

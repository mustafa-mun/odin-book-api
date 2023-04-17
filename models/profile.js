const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// PROFILE MODEL
const ProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  profile_picture: {
    type: String,
    default:
      "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png",
  },
  about: { type: String, default: "About Me" },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

module.exports = mongoose.model("Profile", ProfileSchema);

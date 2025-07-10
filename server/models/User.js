// models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    role: {
      type: String,
      enum: ["ADMIN", "OWNER", "MEMBER"],
      default: "MEMBER",
    },
    profilePictureUrl: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say", ""],
      default: "",
    },
    socialLinks: {
      website: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
  // Pastikan ada password sebelum membandingkan
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  // Hanya hash password jika field 'password' dimodifikasi
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);

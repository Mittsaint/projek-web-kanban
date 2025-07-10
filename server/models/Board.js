const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId, // Merujuk ke ID dari seorang User
    ref: "User",
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId, // Array dari ID User yang menjadi anggota
      ref: "User",
    },
  ],
  isArchived: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Board", BoardSchema);

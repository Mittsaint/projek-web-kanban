const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// --- List Schema ---
const ListSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("List", ListSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  listId: {
    type: Schema.Types.ObjectId,
    ref: "List",
    required: true,
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  labels: [
    {
      type: Schema.Types.ObjectId,
      ref: "Label",
    },
  ],
  isArchived: {
    type: Boolean,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Card", CardSchema);

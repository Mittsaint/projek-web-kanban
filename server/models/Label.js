// --- Label Schema ---
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LabelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
});

module.exports = mongoose.model("Label", LabelSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChecklistItemSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  checklistId: {
    type: Schema.Types.ObjectId,
    ref: "Checklist",
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  position: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("ChecklistItem", ChecklistItemSchema);

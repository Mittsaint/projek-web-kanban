// ==================== Checklist Schema ====================
const ChecklistSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  cardId: {
    type: Schema.Types.ObjectId,
    ref: "Card",
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Checklist", ChecklistSchema);
// --- Comment Schema ---
const CommentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  cardId: {
    type: Schema.Types.ObjectId,
    ref: "Card",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
// ==================== ActivityLog Schema ====================
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivityLogSchema = new Schema(
  {
    BoardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardId: {
      type: Schema.Types.ObjectId,
      ref: "Card",
      // cardId is optional
    },
    description: {
      type: String,
      required: true,
    },
    actionType: {
      type: String,
      enum: [
        "CREATE_BOARD", 
        "UPDATE_BOARD", 
        "ARCHIVE_BOARD", 
        "UNARCHIVE_BOARD", 
        "DELETE_BOARD_PERMANENTLY", 
        "CREATE_CARD",
        "CREATE_COMMENT",
        "MOVE_CARD",
        "ADD_MEMBER"
      ],
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
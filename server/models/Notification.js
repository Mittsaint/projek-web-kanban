// server/models/Notification.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['board_invite', 'card_assigned', 'comment_added', 'general'], // Added 'general' as a default type
      default: 'general',
    },
    relatedId: {
      type: Schema.Types.ObjectId, // e.g., boardId, cardId
      // This field is optional, so no 'required: true'
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Notification", NotificationSchema);

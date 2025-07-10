const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({ boardId, userId, cardId, actionType, description }) => {
  try {
    const activity = new ActivityLog({
      BoardId: boardId, 
      userId,
      cardId,
      actionType,
      description,
      timestamp: new Date(),
    });

    await activity.save();
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
};

module.exports = logActivity;

const Card = require("../models/Card");
const List = require("../models/List");
const logActivity = require("../utils/logger");

// @desc Handle card drag and drop operations
// @route PUT /api/boards/:boardId/dnd
exports.moveCard = async (req, res) => {
  console.log("🔥 DND Triggered!");
  console.log(req.body);

  const {
    cardId,
    sourceListId,
    destListId,
    newPosition, // New position (index) in the destination list
  } = req.body;

  try {
    // Scenario 1: Cards are moved within the same list
    if (sourceListId === destListId) {
      // Update the positions of all cards in the list
      await Card.updateMany(
        { listId: sourceListId, _id: { $ne: cardId } }, // All other cards in the same list
        { $inc: { position: 1 } } // Move their positions
      );
      await Card.updateOne({ _id: cardId }, { position: newPosition });
    }
    // Scenario 2: Cards are moved to a different list
    else {
      // 1. Update the listId and position of the moved card
      await Card.findByIdAndUpdate(cardId, {
        listId: destListId,
        position: newPosition,
      });

      // 2. Update the position of the cards in the OLD list (source)
      await Card.updateMany(
        { listId: sourceListId, position: { $gt: req.body.oldPosition } },
        { $inc: { position: -1 } } // Move up (position decreases)
      );

      // 3. Update the position of the cards in the NEW list (destination)
      await Card.updateMany(
        {
          listId: destListId,
          _id: { $ne: cardId },
          position: { $gte: newPosition },
        },
        { $inc: { position: 1 } } // Move down (position increases)
      );
    }

    // Activity log (optional, but nice to have)
    const card = await Card.findById(cardId);
    const sourceList = await List.findById(sourceListId);
    const destList = await List.findById(destListId);

    await logActivity({
      boardId: card.boardId,
      userId: req.user.id,
      cardId: card._id,
      actionType: "MOVE_CARD",
      description: `move card "${card.title}" from list "${sourceList.title}" to list "${destList.title}"`,
    });

    res.status(200).json({ message: "Card moved successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update list positions after drag and drop
// @route   POST /api/dnd/list
exports.updateListOrder = async (req, res) => {
  const { boardId, orderedLists } = req.body; // orderedLists adalah array of { _id, position }

  try {
    const bulkOps = orderedLists.map((list) => ({
      updateOne: {
        filter: { _id: list._id, boardId: boardId },
        update: { $set: { position: list.position } },
      },
    }));

    if (bulkOps.length > 0) {
      await List.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "List order updated successfully" });
  } catch (error) {
    console.error("Error updating list order:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update card positions after drag and drop (within or between lists)
// @route   POST /api/dnd/card
exports.updateCardOrder = async (req, res) => {
  console.log("🔥 Masuk ke updateCardOrder");
  console.log(req.body);
  const { boardId, sourceList, destList } = req.body;
  console.log("📥 Received DND request:", req.body);

  // sourceList & destList adalah array of { _id, position, listId }

  try {
    // Gabungkan operasi dari list sumber dan tujuan jika berbeda
    const allCardsToUpdate = [...sourceList];
    if (sourceList[0]?.listId !== destList[0]?.listId) {
      allCardsToUpdate.push(...destList);
    }

    const bulkOps = allCardsToUpdate.map((card) => ({
      updateOne: {
        filter: { _id: card._id, boardId: boardId },
        update: { $set: { position: card.position, listId: card.listId } },
      },
    }));

    if (bulkOps.length > 0) {
      await Card.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Card order updated successfully" });
  } catch (error) {
    console.error("Error updating card order:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

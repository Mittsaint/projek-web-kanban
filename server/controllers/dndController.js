const Card = require("../models/Card");
const List = require("../models/List");
const logActivity = require("../utils/logger");

// @desc Handle card drag and drop operations
// @route PUT /api/boards/:boardId/dnd
exports.moveCard = async (req, res) => {
  console.log("\uD83D\uDD25 DND Triggered!");
  console.log(req.body);

  const {
    cardId,
    sourceListId,
    destListId,
    newPosition,
  } = req.body;

  try {
    if (sourceListId === destListId) {
      await Card.updateMany(
        { listId: sourceListId, _id: { $ne: cardId } },
        { $inc: { position: 1 } }
      );
      await Card.updateOne({ _id: cardId }, { position: newPosition });
    } else {
      await Card.findByIdAndUpdate(cardId, {
        listId: destListId,
        position: newPosition,
      });

      await Card.updateMany(
        { listId: sourceListId, position: { $gt: req.body.oldPosition } },
        { $inc: { position: -1 } }
      );

      await Card.updateMany(
        {
          listId: destListId,
          _id: { $ne: cardId },
          position: { $gte: newPosition },
        },
        { $inc: { position: 1 } }
      );
    }

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

// @desc Update list positions after drag and drop
// @route POST /api/dnd/list
exports.updateListOrder = async (req, res) => {
  const { boardId, orderedLists } = req.body;

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

// @desc Update card positions after drag and drop (within or between lists)
// @route POST /api/dnd/card
exports.updateCardOrder = async (req, res) => {
  console.log("\uD83D\uDD25 Masuk ke updateCardOrder");
  console.log(req.body);
  const { boardId, sourceList, destList } = req.body;
  console.log("\uD83D\uDCE5 Received DND request:", req.body);

  try {
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

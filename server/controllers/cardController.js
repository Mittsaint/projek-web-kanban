const Card = require("../models/Card");
const List = require("../models/List");
const Board = require("../models/Board");
const logActivity = require("../utils/logger");

const hasBoardAccess = async (userId, boardId) => {
  const board = await Board.findById(boardId);
  if (!board) return false;
  return (
    board.ownerId.toString() === userId.toString() ||
    board.members.some((m) => m.toString() === userId.toString())
  );
};

exports.createCard = async (req, res) => {
  const { title } = req.body;
  const { listId } = req.params;

  try {
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ msg: "List not found" });

    if (!(await hasBoardAccess(req.user.id, list.boardId))) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const cardCount = await Card.countDocuments({ listId });

    const card = await Card.create({
      title,
      listId,
      boardId: list.boardId,
      creatorId: req.user.id,
      position: cardCount,
    });

    await logActivity({
      boardId: card.boardId,
      userId: req.user.id,
      cardId: card._id,
      actionType: "CREATE_CARD",
      description: `added card \"${card.title}\" to list \"${list.title}\"`,
    });

    res.status(201).json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getCardByList = async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) return res.status(404).json({ msg: "List not found" });

    if (!(await hasBoardAccess(req.user.id, list.boardId))) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const cards = await Card.find({ listId: req.params.listId })
      .populate("labels")
      .sort({ position: "asc" });
    res.json(cards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateCard = async (req, res) => {
  const { cardId } = req.params;
  const { title, description, dueDate } = req.body;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ msg: "Card not found" });

    if (!(await hasBoardAccess(req.user.id, card.boardId))) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (dueDate) updateFields.dueDate = dueDate;

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $set: updateFields },
      { new: true }
    );

    await logActivity({
      boardId: updatedCard.boardId,
      userId: req.user.id,
      cardId: updatedCard._id,
      actionType: "UPDATE_CARD",
      description: `updated card \"${updatedCard.title}\"`,
    });

    res.json(updatedCard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const { permanent } = req.query;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ msg: "Card not found" });

    if (!(await hasBoardAccess(req.user.id, card.boardId))) {
      return res.status(403).json({ msg: "Access denied" });
    }

    if (permanent === "true") {
      await Card.findByIdAndDelete(cardId);
      await logActivity({
        boardId: card.boardId,
        userId: req.user.id,
        actionType: "DELETE_CARD",
        description: `permanently deleted card \"${card.title}\"`,
      });
      return res.json({ msg: "Card permanently deleted" });
    } else {
      card.isArchived = true;
      await card.save();
      await logActivity({
        boardId: card.boardId,
        userId: req.user.id,
        cardId: card._id,
        actionType: "ARCHIVE_CARD",
        description: `archived card \"${card.title}\"`,
      });
      return res.json({ msg: "Card archived successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.copyCard = async (req, res) => {
  try {
    const originalCard = await Card.findById(req.params.cardId);
    if (!originalCard) return res.status(404).json({ msg: "Card not found" });

    if (!(await hasBoardAccess(req.user.id, originalCard.boardId))) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const cardCount = await Card.countDocuments({
      listId: originalCard.listId,
    });

    const newCard = new Card({
      ...originalCard.toObject(),
      _id: undefined,
      title: `${originalCard.title} (Copy)`,
      position: cardCount,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

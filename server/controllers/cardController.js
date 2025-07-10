const Card = require("../models/Card");
const List = require("../models/List");
const logActivity = require("../utils/logger");

// Create a new card
// Create a new card
exports.createCard = async (req, res) => {
  const { title } = req.body; // We only need the title from the body
  const { listId } = req.params;

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ msg: "List not found" });
    }

    // Get the position for the new card
    const cardCount = await Card.countDocuments({ listId });

    const newCard = new Card({
      title,
      listId,
      boardId: list.boardId,
      // FIX: Get creatorId from the authenticated user for security
      creatorId: req.user.id,
      position: cardCount,
    });

    const card = await newCard.save();

    // Call Logger
    await logActivity({
      // FIX: Use 'boardId' (lowercase 'b') to match the Activity schema
      boardId: card.boardId,
      userId: req.user.id,
      cardId: card._id,
      actionType: "CREATE_CARD",
      description: `added card "${card.title}" to list "${list.title}"`,
    });

    res.status(201).json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all cards from List
exports.getCardByList = async (req, res) => {
  try {
    // FIX: Changed reqParams.boardId to req.params.listId
    const cards = await Card.find({ listId: req.params.listId })
      .populate("labels") // Ini akan mengambil detail dari setiap label
      .sort({ position: "asc" });
    res.json(cards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc  Update a card (title, description, dueDate)
// @route PUT /api/cards/:cardId
exports.updateCard = async (req, res) => {
  const { cardId } = req.params;
  // Get eligible data that can update from the body
  const { title, description, dueDate } = req.body;

  try {
    // find card that want to get update
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ msg: "Card not found" }); // Changed "Card not" to "Card not found"
    }

    // Update
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (dueDate) updateFields.dueDate = dueDate;

    // Use findByIdAndUpdate for direct update
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $set: updateFields },
      { new: true } // Return the updated document
    );

    // Activity Log
    await logActivity({
      boardId: updatedCard.boardId, // Changed to BoardId
      userId: req.user.id,
      cardId: updatedCard._id,
      actionType: "UPDATE_CARD", // Changed to UPDATE_CARD for consistency with ActivityLog enum
      description: `updated card "${updatedCard.title}"`, // Changed language to English
    });

    res.json(updatedCard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc  Archive /delete a card (soft delete)
// @route DELETE /api/cards/:cardId
exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    // Soft delete
    card.isArchived = true;
    await card.save();

    // Activity Log
    await logActivity({
      boardId: card.boardId, // Changed to BoardId
      userId: req.user.id,
      cardId: card._id,
      actionType: "ARCHIVE_CARD",
      description: `archived card "${card.title}"`, // Changed language to English
    });

    res.json({ msg: "Card archived successfully" }); // Changed "succesfully" to "successfully"
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Permanently delete a card
// @route   DELETE /api/cards/:cardId
exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    // Find the card to get its details before deleting
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    // --- MODIFICATION ---
    // Permanently delete the card from the database
    await Card.findByIdAndDelete(cardId);

    // Activity Log
    await logActivity({
      boardId: card.boardId,
      userId: req.user.id,
      actionType: "DELETE_CARD", // Use a more appropriate action type
      description: `dihapus permanen kartu "${card.title}"`,
    });

    res.json({ msg: "Card permanently deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.copyCard = async (req, res) => {
  try {
    const originalCard = await Card.findById(req.params.cardId);
    if (!originalCard) return res.status(404).json({ msg: "Card not found" });

    const cardCount = await Card.countDocuments({
      listId: originalCard.listId,
    });

    const newCard = new Card({
      ...originalCard.toObject(),
      _id: undefined, // Hapus ID agar MongoDB membuat yang baru
      title: `${originalCard.title} (Copy)`,
      position: cardCount,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

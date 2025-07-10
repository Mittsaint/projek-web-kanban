const Label = require("../models/Label");
const Card = require("../models/Card");
const Board = require("../models/Board");

// @desc    Create a new label for a board
// @route   POST /api/boards/:boardId/labels
exports.createLabelForBoard = async (req, res) => {
  const { name, color } = req.body;
  const { boardId } = req.params;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    const newLabel = new Label({ name, color, boardId });
    const label = await newLabel.save();
    res.status(201).json(label);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get all labels for a board
// @route   GET /api/boards/:boardId/labels
exports.getLabelsByBoard = async (req, res) => {
  try {
    const labels = await Label.find({ boardId: req.params.boardId });
    res.json(labels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Add a label to a card
// @route   POST /api/cards/:cardId/labels
exports.addLabelToCard = async (req, res) => {
  const { labelId } = req.body;
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }
    // Tambahkan labelId ke array 'labels' jika belum ada
    await Card.findByIdAndUpdate(cardId, { $addToSet: { labels: labelId } });
    res.json({ msg: "Label added to card" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Remove a label from a card
// @route   DELETE /api/cards/:cardId/labels/:labelId
exports.removeLabelFromCard = async (req, res) => {
  const { cardId, labelId } = req.params;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }
    // Hapus labelId dari array 'labels'
    await Card.findByIdAndUpdate(cardId, { $pull: { labels: labelId } });
    res.json({ msg: "Label removed from card" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

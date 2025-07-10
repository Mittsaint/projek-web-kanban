// server/controllers/listController.js

const List = require("../models/List");
const Board = require("../models/Board");
const Card = require("../models/Card"); // Make sure Card model is imported

// Create a new List
exports.createdList = async (req, res) => {
  const { title } = req.body;
  const { boardId } = req.params; // Get boardId from URL

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    // Choose list position
    const ListCount = await List.countDocuments({ boardId });

    const newList = new List({
      title,
      boardId,
      position: ListCount,
    });

    const list = await newList.save();
    res.status(201).json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all list from board
exports.getListByBoard = async (req, res) => {
  try {
    const lists = await List.find({ boardId: req.params.boardId }).sort({
      position: "asc",
    });
    res.json(lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update List
exports.updateList = async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ msg: "List not found" });
    }

    // Check if user is member of the board
    const board = await Board.findById(list.boardId);
    if (!board.members.includes(req.user.id)) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    list.title = req.body.title || list.title;
    await list.save();
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// --- MODIFIED SECTION ---
// Permanently delete a list and all its cards
exports.deleteList = async (req, res) => {
  try {
    const listId = req.params.listId;
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ msg: "List not found" });
    }

    // (Optional but recommended) Check if the user is authorized
    const board = await Board.findById(list.boardId);
    if (!board.members.includes(req.user.id)) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Delete all cards within the list first
    await Card.deleteMany({ listId: listId });

    // Then, permanently delete the list itself
    await List.findByIdAndDelete(listId);

    res.json({ msg: "List and its cards deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
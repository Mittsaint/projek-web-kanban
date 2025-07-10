// server/controllers/listController.js

const List = require("../models/List");
const Board = require("../models/Board");
const Card = require("../models/Card");

// Utility to check board access
const hasBoardAccess = async (userId, boardId) => {
  const board = await Board.findById(boardId);
  return board && board.members.map((id) => id.toString()).includes(userId);
};

// Create a new List
exports.createdList = async (req, res) => {
  const { title } = req.body;
  const { boardId } = req.params;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ msg: "Board not found" });
    if (!(await hasBoardAccess(req.user.id, boardId))) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const listCount = await List.countDocuments({ boardId });
    const newList = new List({ title, boardId, position: listCount });
    const list = await newList.save();

    res.status(201).json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all lists from board
exports.getListByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    if (!(await hasBoardAccess(req.user.id, boardId))) {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    const lists = await List.find({ boardId }).sort({ position: "asc" });
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
    if (!list) return res.status(404).json({ msg: "List not found" });

    if (!(await hasBoardAccess(req.user.id, list.boardId))) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    list.title = req.body.title || list.title;
    await list.save();
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Permanently delete a list and its cards
exports.deleteList = async (req, res) => {
  try {
    const listId = req.params.listId;
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ msg: "List not found" });

    if (!(await hasBoardAccess(req.user.id, list.boardId))) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await Card.deleteMany({ listId });
    await List.findByIdAndDelete(listId);

    res.json({ msg: "List and its cards deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

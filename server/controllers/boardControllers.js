// boardControllers.js
const Board = require("../models/Board");
const User = require("../models/User");
const Label = require("../models/Label");
const logActivity = require("../utils/logger");

// Create new board
exports.createBoard = async (req, res) => {
  const { title } = req.body;

  try {
    const newBoard = new Board({
      title,
      ownerId: req.user.id,
      members: [req.user.id],
    });

    const board = await newBoard.save();
    // 2. Definisikan label default
    const defaultLabels = [
      { name: "Feature", color: "#60A5FA" }, // blue-400
      { name: "Bug", color: "#F87171" }, // red-400
      { name: "Refactor", color: "#FBBF24" }, // amber-400
      { name: "Testing", color: "#34D399" }, // emerald-400
      { name: "Docs", color: "#A78BFA" }, // violet-400
    ];

    // 3. Buat semua label default untuk board yang baru ini
    const labelsToCreate = defaultLabels.map((label) => ({
      ...label,
      boardId: board._id,
    }));
    await Label.insertMany(labelsToCreate);

    // Log this activity
    await logActivity({
      boardId: board._id, // Changed from boardId to BoardId
      userId: req.user.id,
      actionType: "CREATE_BOARD",
      description: `created board "${board.title}"`,
    });
    res.status(201).json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all ACTIVE boards for a user
exports.getBoards = async (req, res) => {
  try {
    // Find boards where the user is a member and the board is not archived
    const boards = await Board.find({
      members: req.user.id,
      isArchived: false, // Only get active boards
    }).populate("ownerId", "name email");
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all ARCHIVED boards for a user
exports.getArchivedBoards = async (req, res) => {
  try {
    // Find boards where the user is a member and the board is archived
    const boards = await Board.find({
      members: req.user.id,
      isArchived: true, // Only get archived boards
    }).populate("ownerId", "name email");
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get a single board by ID
exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId)
      .populate("ownerId", "name email")
      .populate("members", "name email"); // Populate owner and members
    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }
    // Check if the user is a member of the board
    if (
      !board.members.some((member) => member._id.toString() === req.user.id)
    ) {
      return res
        .status(401)
        .json({ msg: "User not authorized to view this board" });
    }
    res.json(board);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Board not found" });
    }
    res.status(500).send("Server Error");
  }
};

// Update Board Title
exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    // Check if user is the owner
    if (board.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    board.title = req.body.title || board.title;
    const updatedBoard = await board.save();

    // Activity Log
    await logActivity({
      boardId: board._id, // Changed from boardId to BoardId
      userId: req.user.id,
      actionType: "UPDATE_BOARD",
      description: `changed board name to "${updatedBoard.title}"`,
    });

    res.json(updatedBoard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Archive a board
exports.archiveBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    // Check if user is the owner to archive
    if (board.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    board.isArchived = true;
    await board.save();

    // Log this activity
    await logActivity({
      boardId: board._id,
      userId: req.user.id,
      actionType: "ARCHIVE_BOARD",
      description: `archived board "${board.title}"`,
    });

    res.json({ msg: "Board archived successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Board not found" });
    }
    res.status(500).send("Server Error");
  }
};

// UN-Archive a board
exports.unarchiveBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }
    if (board.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    board.isArchived = false;
    await board.save();
    // Optional: Log this activity
    await logActivity({
      boardId: board._id,
      userId: req.user.id,
      actionType: "UNARCHIVE_BOARD",
      description: `unarchived board "${board.title}"`,
    });
    res.json({ msg: "Board unarchived successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// PERMANENTLY Delete a board
exports.deleteBoardPermanently = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }
    if (board.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // TODO: Before deleting the board, you should also delete all associated lists, cards, etc.
    // This requires more complex logic. For now, we just delete the board itself.

    await Board.findByIdAndDelete(req.params.boardId);

    // Optional: Log this activity
    await logActivity({
      boardId: req.params.boardId,
      userId: req.user.id,
      actionType: "DELETE_BOARD_PERMANENTLY",
      description: `permanently deleted board "${board.title}"`,
    });
    res.json({ msg: "Board permanently deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Create a new board from a template with predefined lists
exports.createBoardFromTemplate = async (req, res) => {
  const { title, listTitles } = req.body; // Expect title and an array of list titles

  if (!title || !listTitles) {
    return res
      .status(400)
      .json({ msg: "Please provide a title and list titles" });
  }

  try {
    // 1. Create the new board
    const newBoard = new Board({
      title,
      ownerId: req.user.id,
      members: [req.user.id],
    });
    const board = await newBoard.save();

    // 2. Create the lists for that board
    if (listTitles.length > 0) {
      const listsToCreate = listTitles.map((listTitle, index) => ({
        title: listTitle,
        boardId: board._id,
        position: index,
      }));
      await List.insertMany(listsToCreate);
    }

    // 3. Log the activity
    await logActivity({
      boardId: board._id,
      userId: req.user.id,
      actionType: "CREATE_BOARD",
      description: `created board "${board.title}" from a template`,
    });

    // 4. Return the newly created board
    res.status(201).json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateBoardLayout = async (req, res) => {
  const { lists } = req.body; // Menerima seluruh struktur list dan kartu yang baru

  try {
    const bulkOps = [];

    lists.forEach((list, listIndex) => {
      // Operasi untuk update posisi list
      bulkOps.push({
        updateOne: {
          filter: { _id: list._id },
          update: { position: listIndex }
        }
      });

      // Operasi untuk update posisi dan listId setiap kartu
      list.cards.forEach((card, cardIndex) => {
        bulkOps.push({
          updateOne: {
            filter: { _id: card._id },
            update: { position: cardIndex, listId: list._id }
          }
        });
      });
    });

    // Pisahkan operasi untuk List dan Card
    const listOps = bulkOps.filter(op => op.updateOne.filter._id.toString().length === 24 && List.exists({_id: op.updateOne.filter._id})); // Filter berdasarkan model
    const cardOps = bulkOps.filter(op => op.updateOne.filter._id.toString().length === 24 && Card.exists({_id: op.updateOne.filter._id}));


    if (listOps.length > 0) {
      await List.bulkWrite(listOps.map(op => op.updateOne.filter._id.toString().length === 24 ? op : null).filter(Boolean));
    }
    if (cardOps.length > 0) {
      await Card.bulkWrite(cardOps.map(op => op.updateOne.filter._id.toString().length === 24 ? op : null).filter(Boolean));
    }

    res.status(200).json({ message: "Board layout updated successfully" });
  } catch (error) {
    console.error("Error updating board layout:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.togglePinBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ msg: "Board not found" });
    if (!board.members.includes(req.user.id))
      return res.status(403).json({ msg: "Unauthorized" });

    board.isPinned = !board.isPinned;
    await board.save();

    res.json({ msg: `Board ${board.isPinned ? "pinned" : "unpinned"}`, isPinned: board.isPinned });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}
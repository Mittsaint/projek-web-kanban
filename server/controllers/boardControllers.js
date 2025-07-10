// boardControllers.js
const Board = require("../models/Board");
const User = require("../models/User");
const Label = require("../models/Label");
const logActivity = require("../utils/logger");

// Helper function to check user access (member or owner)
const hasBoardAccess = (board, userId) => {
  return (
    board.ownerId.toString() === userId ||
    board.members.some((member) => member.toString() === userId)
  );
};

// Create new board
exports.createBoard = async (req, res) => {
  const { title } = req.body || {};
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const newBoard = new Board({
      title,
      ownerId: req.user.id,
      members: [req.user.id],
    });

    const board = await newBoard.save();

    const defaultLabels = [
      { name: "Feature", color: "#60A5FA" },
      { name: "Bug", color: "#F87171" },
      { name: "Refactor", color: "#FBBF24" },
      { name: "Testing", color: "#34D399" },
      { name: "Docs", color: "#A78BFA" },
    ];

    const labelsToCreate = defaultLabels.map((label) => ({
      ...label,
      boardId: board._id,
    }));
    await Label.insertMany(labelsToCreate);

    await logActivity({
      boardId: board._id,
      userId: req.user.id,
      actionType: "CREATE_BOARD",
      description: `created board \"${board.title}\"`,
    });

    res.status(201).json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all active boards
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      members: req.user.id,
      isArchived: false,
    }).populate("ownerId", "name email");
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get archived boards
exports.getArchivedBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      members: req.user.id,
      isArchived: true,
    }).populate("ownerId", "name email");
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get board by ID with access validation
exports.getBoardById = async (req, res) => {
  try {
    let board = await Board.findById(req.params.id)
      .populate("members", "name email")
      .populate({
        path: "lists",
        populate: { path: "cards" },
      });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const isMember = board.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      // Push ke DB
      board.members.push(req.user._id);
      await board.save();

      // Populate ulang board yang sudah diubah
      board = await Board.findById(req.params.id)
        .populate("members", "name email")
        .populate({
          path: "lists",
          populate: { path: "cards" },
        });

      console.log(`${req.user.email} joined board ${board._id}`);
    }

    return res.status(200).json(board);
  } catch (error) {
    console.error("Get board error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update board title (only owner)
exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    if (board.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only owner can update" });
    }

    board.title = req.body.title || board.title;
    const updatedBoard = await board.save();

    await logActivity({
      boardId: board._id,
      userId: req.user.id,
      actionType: "UPDATE_BOARD",
      description: `changed board name to \"${updatedBoard.title}\"`,
    });

    res.json(updatedBoard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Archive board (only owner)
exports.archiveBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    if (board.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only owner can archive" });
    }

    board.isArchived = true;
    await board.save();

    await logActivity({
      boardId: board._id,
      userId: req.user.id,
      actionType: "ARCHIVE_BOARD",
      description: `archived board \"${board.title}\"`,
    });

    res.json({ msg: "Board archived successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Unarchive board (only owner)
exports.unarchiveBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    if (board.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only owner can unarchive" });
    }

    board.isArchived = false;
    await board.save();

    await logActivity({
      boardId: board._id,
      userId: req.user.id,
      actionType: "UNARCHIVE_BOARD",
      description: `unarchived board \"${board.title}\"`,
    });

    res.json({ msg: "Board unarchived successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete board (only owner)
exports.deleteBoardPermanently = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    if (board.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only owner can delete" });
    }

    await Board.findByIdAndDelete(req.params.boardId);

    await logActivity({
      boardId: req.params.boardId,
      userId: req.user.id,
      actionType: "DELETE_BOARD_PERMANENTLY",
      description: `permanently deleted board \"${board.title}\"`,
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
          update: { position: listIndex },
        },
      });

      // Operasi untuk update posisi dan listId setiap kartu
      list.cards.forEach((card, cardIndex) => {
        bulkOps.push({
          updateOne: {
            filter: { _id: card._id },
            update: { position: cardIndex, listId: list._id },
          },
        });
      });
    });

    // Pisahkan operasi untuk List dan Card
    const listOps = bulkOps.filter(
      (op) =>
        op.updateOne.filter._id.toString().length === 24 &&
        List.exists({ _id: op.updateOne.filter._id })
    ); // Filter berdasarkan model
    const cardOps = bulkOps.filter(
      (op) =>
        op.updateOne.filter._id.toString().length === 24 &&
        Card.exists({ _id: op.updateOne.filter._id })
    );

    if (listOps.length > 0) {
      await List.bulkWrite(
        listOps
          .map((op) =>
            op.updateOne.filter._id.toString().length === 24 ? op : null
          )
          .filter(Boolean)
      );
    }
    if (cardOps.length > 0) {
      await Card.bulkWrite(
        cardOps
          .map((op) =>
            op.updateOne.filter._id.toString().length === 24 ? op : null
          )
          .filter(Boolean)
      );
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

    res.json({
      msg: `Board ${board.isPinned ? "pinned" : "unpinned"}`,
      isPinned: board.isPinned,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.addMemberToBoard = async (req, res) => {
  const { email } = req.body;
  const { boardId } = req.params;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const board = await Board.findById(boardId);
  if (!board) return res.status(404).json({ msg: "Board not found" });

  // Optional: Only owner can invite
  if (board.ownerId.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ msg: "Only the board owner can invite members" });
  }

  if (!board.members.includes(user._id)) {
    board.members.push(user._id);
    await board.save();

    await logActivity({
      boardId,
      userId: req.user.id,
      actionType: "ADD_MEMBER",
      description: `added ${user.email} to the board`,
    });
  }

  res.status(200).json({
    msg: "Member added",
    member: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

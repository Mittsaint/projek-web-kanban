const logActivity = require("../utils/logger");
const Comment = require("../models/Comment");
const Card = require("../models/Card");

exports.createComment = async (req, res) => {
  const { text } = req.body;
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    const newComment = new Comment({
      text,
      cardId,
      userId: req.user.id,
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id)
      .populate("userId", "name email");

    // ✅ Logging aktivitas tanpa menghentikan proses jika gagal
    logActivity({
      boardId: card.boardId,
      userId: req.user.id,
      cardId: card._id,
      actionType: "CREATE_COMMENT",
      description: `memberi komentar pada card "${card.title}"`,
    }).catch((err) => {
      console.error("Activity log failed (ignored):", err.message);
    });

    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("Error creating comment:", err.message);
    res.status(500).send("Server Error");
  }
};


// @desc    Get all comments for a specific card
// @route   GET /api/cards/:cardId/comments
exports.getCommentsByCard = async (req, res) => {
  try {
    const comments = await Comment.find({ cardId: req.params.cardId })
      .populate("userId", "name email") // Tampilkan juga info user yang berkomentar
      .sort({ createdAt: "asc" }); // Urutkan dari yang paling lama

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update a Comment
exports.updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    // Cek apakah user adalah pembuat komentar
    if (comment.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { text: req.body.text },
      { new: true }
    );
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete a Comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await comment.deleteOne();
    res.json({ msg: "Comment removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

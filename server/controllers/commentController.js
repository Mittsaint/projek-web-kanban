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

exports.getCommentsByCard = async (req, res) => {
  try {
    const comments = await Comment.find({ cardId: req.params.cardId })
      .populate("userId", "name email")
      .sort({ createdAt: "asc" });

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
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

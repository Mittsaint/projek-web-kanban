// src/components/board/ActivitySection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import boardService from "../../services/boardService";
import Icon from "../icon/Icon";
import { formatDistanceToNow } from "date-fns";

const ActivitySection = ({ cardId }) => {
  const { user } = useAuth(); // Untuk mengetahui siapa yang sedang login
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null); // Menyimpan { id, text }

  const fetchComments = useCallback(async () => {
    try {
      const result = await boardService.comments.getByCard(cardId);
      setComments(result ?? []); // 🔥 safe fallback
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setComments([]); // 🔥 tetap set kosong supaya map tidak error
    } finally {
      setIsLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async () => {
    if (!newCommentText.trim()) return;
    try {
      await boardService.comments.add(cardId, { text: newCommentText });
      setNewCommentText("");
      fetchComments(); // Ambil ulang komentar untuk menampilkan yang baru
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const handleUpdateComment = async () => {
    if (!editingComment || !editingComment.text.trim()) return;
    try {
      await boardService.comments.update(editingComment.id, {
        text: editingComment.text,
      });
      setEditingComment(null); // Keluar dari mode edit
      fetchComments(); // Refresh daftar komentar
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await boardService.comments.delete(commentId);
        fetchComments(); // Refresh daftar komentar
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <Icon
          name="activity"
          className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-3"
        />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Activity
        </h3>
      </div>
      <div className="ml-8 space-y-4">
        {/* Form untuk menambah komentar baru */}
        <div className="flex items-start gap-3">
          <img
            src={
              user?.profilePictureUrl ||
              `https://ui-avatars.com/api/?name=${user?.name}&background=random`
            }
            alt="user"
            className="h-8 w-8 rounded-full"
          />
          <div className="w-full">
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            />
            <button
              onClick={handlePostComment}
              disabled={!newCommentText.trim()}
              className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>

        {/* Daftar Komentar */}
        <div className="space-y-4">
          {!Array.isArray(comments) ? (
            <p className="text-sm text-gray-400">Failed to load comments</p>
          ) : isLoading ? (
            <p className="text-sm text-gray-400">Loading comments...</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-3">
                <img
                  src={
                    comment.userId.profilePictureUrl ||
                    `https://ui-avatars.com/api/?name=${comment.userId.name}&background=random`
                  }
                  alt={comment.userId.name}
                  className="h-8 w-8 rounded-full"
                />
                <div className="w-full">
                  <div className="flex items-baseline gap-2">
                    <p className="font-bold text-sm dark:text-white">
                      {comment.userId.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  {editingComment?.id === comment._id ? (
                    // Tampilan saat mode edit
                    <div className="mt-1">
                      <textarea
                        value={editingComment.text}
                        onChange={(e) =>
                          setEditingComment({
                            ...editingComment,
                            text: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-sm"
                        rows="2"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={handleUpdateComment}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingComment(null)}
                          className="text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Tampilan normal
                    <div>
                      <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm dark:text-gray-200">
                        {comment.text}
                      </div>
                      {user._id === comment.userId._id && (
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <button
                            onClick={() =>
                              setEditingComment({
                                id: comment._id,
                                text: comment.text,
                              })
                            }
                            className="hover:underline"
                          >
                            Edit
                          </button>
                          <span>&middot;</span>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitySection;

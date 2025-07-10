import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MoreVertical,
  Edit,
  Archive,
  Trash,
  Users, // ✅ Tambahkan ini
} from "lucide-react";
import boardService from "../../services/boardService";
import { Pin } from "lucide-react";

const BoardCard = ({ board, onRefresh }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(board.title);

  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || newTitle === board.title) {
      setIsEditing(false);
      return;
    }
    try {
      await boardService.boards.update(board._id, { title: newTitle });
      onRefresh();
    } catch (err) {
      console.error("Error updating board title", err);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete board "${board.title}" permanently?`
    );
    if (!confirmed) return;
    try {
      await boardService.boards.deletePermanently(board._id);
      onRefresh();
    } catch (err) {
      console.error("Error deleting board", err);
    }
  };

  const handleArchive = async () => {
    const confirmed = window.confirm(`Archive board "${board.title}"?`);
    if (!confirmed) return;
    try {
      await boardService.boards.archive(board._id);
      onRefresh();
    } catch (err) {
      console.error("Error archiving board", err);
    }
  };

  const handleTogglePin = async () => {
    try {
      await boardService.boards.togglePin(board._id);
      onRefresh();
    } catch (err) {
      console.error("Failed to toggle pin", err);
    }
  };

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 group overflow-hidden ${
        isMenuOpen ? "z-30" : "z-10"
      }`}
    >
      {/* Top Gradient / Cover */}
      <div className="h-24 bg-gradient-to-br from-purple-500 to-pink-500 relative">
        {board.isPinned && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-xs text-white px-2 py-1 rounded-full font-medium shadow">
            📌 Pinned
          </div>
        )}
      </div>

      {/* Title and owner */}
      <div className="p-5 space-y-1">
        {isEditing ? (
          <form onSubmit={handleSave}>
            <input
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === "Escape" && setIsEditing(false)}
              className="w-full text-lg font-semibold bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg focus:ring-2 ring-blue-500 outline-none"
            />
          </form>
        ) : (
          <Link to={`/board/${board._id}`} className="block group">
            <h3
              className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 truncate transition-colors"
              title={board.title}
            >
              {board.title}
            </h3>
            <p
              className="text-xs text-gray-500 dark:text-gray-400 truncate"
              title={board.ownerId?.name}
            >
              Owned by {board.ownerId?.name || "Unknown"}
            </p>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-4 border-t pt-3 border-gray-200 dark:border-gray-700">
              <Users className="h-4 w-4 mr-1.5" />
              {board.members?.length || 1} Members
            </div>
          </Link>
        )}
      </div>

      {/* Dropdown menu button */}
      <div className="absolute top-3 right-3 z-50" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
        >
          <MoreVertical size={18} />
        </button>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
            <button
              onClick={() => {
                setIsEditing(true);
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 text-left gap-2"
            >
              <Edit size={16} /> Edit title
            </button>

            <button
              onClick={handleTogglePin}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 text-left gap-2"
            >
              <Pin size={16} />
              {board.isPinned ? "Unpin board" : "Pin board"}
            </button>

            <button
              onClick={handleArchive}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 text-left gap-2"
            >
              <Archive size={16} /> Archive board
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center w-full px-4 py-3 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left gap-2"
            >
              <Trash size={16} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardCard;

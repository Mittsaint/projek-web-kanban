// src/components/ChecklistView.jsx
import React, { useState, useMemo } from "react";
import boardService from "../../services/boardService";
// Impor komponen Icon dari CardDetailModal atau file bersama lainnya

const ChecklistView = ({ checklist, onUpdate, onDeleteRequest, Icon }) => {
  const [newItemText, setNewItemText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = useMemo(
    () => checklist.items.filter((item) => item.isCompleted).length,
    [checklist.items]
  );
  const progress = useMemo(
    () =>
      checklist.items.length > 0
        ? (completedCount / checklist.items.length) * 100
        : 0,
    [completedCount, checklist.items.length]
  );

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;
    try {
      await boardService.checklists.addItem(checklist._id, {
        text: newItemText,
      });
      setNewItemText("");
      setIsAdding(false);
      onUpdate(); // Refresh data di modal
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  const handleToggleItem = async (itemId, isCompleted) => {
    try {
      await boardService.checklists.updateItem(checklist._id, itemId, {
        isCompleted: !isCompleted,
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to toggle item:", error);
    }
  };

  const handleDeleteChecklist = async () => {
    onDeleteRequest(checklist._id, checklist.title);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await boardService.checklists.deleteItem(checklist._id, itemId);
      onUpdate(); // Refresh after deletion
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Icon
            name="checklist"
            className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-3"
          />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {checklist.title}
          </h3>
        </div>
        <button
          onClick={handleDeleteChecklist}
          className="text-xs text-gray-400 hover:text-red-500"
        >
          Delete
        </button>
      </div>
      <div className="ml-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold">{Math.round(progress)}%</span>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="space-y-2">
          {checklist.items.map((item) => (
            <div key={item._id} className="flex items-center gap-3 group">
              <input
                type="checkbox"
                checked={item.isCompleted}
                onChange={() => handleToggleItem(item._id, item.isCompleted)}
                className="w-4 h-4 rounded text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span
                className={`flex-1 text-sm ${
                  item.isCompleted
                    ? "line-through text-gray-400"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {item.text}
              </span>
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="text-gray-400 hover:text-red-500 text-xs"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        {isAdding ? (
          <div className="mt-2 space-y-2">
            <textarea
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add an item"
              className="w-full p-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
              rows="2"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddItem}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Add
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="text-xl hover:text-gray-600"
              >
                &times;
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-sm rounded-md w-full text-left hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Add an item
          </button>
        )}
      </div>
    </div>
  );
};

export default ChecklistView;

import React, { useState } from "react";
import Icon from "../icon/Icon";
import boardService from "../../services/boardService";

const LabelPopover = ({ card, boardLabels, onUpdate, onClose, board }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#60A5FA");

  // Membuat Set dari ID label yang sudah ada di kartu untuk pengecekan cepat
  const cardLabelIds = new Set(card.labels.map((l) => l._id));
  const customLabelsCount = boardLabels.filter(
    (l) => !["Feature", "Bug", "Refactor", "Testing", "Docs"].includes(l.name)
  ).length;
  const colorPalette = [
    "#60A5FA",
    "#F87171",
    "#FBBF24",
    "#34D399",
    "#A78BFA",
    "#F472B6",
    "#FB923C",
    "#22D3EE",
    "#A3E635",
    "#F97316",
    "#8B5CF6",
    "#EC4899",
  ];

  // --- FUNGSI UTAMA UNTUK MENAMBAH/MENGHAPUS LABEL DARI KARTU ---
  const handleLabelToggle = async (labelId, shouldAdd) => {
    try {
      if (shouldAdd) {
        await boardService.cards.addLabel(card._id, labelId);
      } else {
        await boardService.cards.removeLabel(card._id, labelId);
      }
      onUpdate(); // Memicu refresh data di BoardDetailPage
    } catch (error) {
      console.error("Failed to toggle label:", error);
    }
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim() || !selectedColor) return;

    try {
      await boardService.labels.create(board._id, {
        name: newLabelName,
        color: selectedColor,
      });
      onUpdate(); // Memicu refresh data di BoardDetailPage
      setNewLabelName("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create label:", error);
    }
  };

  return (
    <div className="absolute z-20 w-72 bg-gray-100 dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 p-4 mt-2">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200">
          Labels
        </h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <Icon name="x-mark" className="h-5 w-5" />
        </button>
      </div>

      {/* Bagian untuk menampilkan dan memilih label */}
      <div className="space-y-2 mb-4">
        {boardLabels.map((label) => {
          const isApplied = cardLabelIds.has(label._id);
          return (
            <div key={label._id} className="flex items-center gap-2">
              <div
                onClick={() => handleLabelToggle(label._id, !isApplied)}
                className="flex-1 flex items-center p-2 rounded cursor-pointer hover:opacity-80"
                style={{ backgroundColor: label.color }}
              >
                <span className="font-semibold text-white text-sm">
                  {label.name}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isApplied}
                onChange={() => handleLabelToggle(label._id, !isApplied)}
                className="w-5 h-5 rounded text-blue-500 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              />
            </div>
          );
        })}
      </div>
      <hr className="border-gray-200 dark:border-gray-600 my-4" />

      {isCreating ? (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
            Create a new label
          </p>
          <input
            type="text"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            placeholder="Label name..."
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-sm"
          />
          <div className="grid grid-cols-6 gap-2">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                  selectedColor === color
                    ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800"
                    : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateLabel}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium"
            >
              Create
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-sm rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        customLabelsCount < 10 && (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Create a new label
          </button>
        )
      )}
      {customLabelsCount >= 10 && (
        <p className="text-xs text-center text-gray-400">
          You have reached the limit of 10 custom labels.
        </p>
      )}
    </div>
  );
};

export default LabelPopover;

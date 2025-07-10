import React, { useState } from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";

const ListColumn = ({ list, onCardClick, onAddCard, onDeleteList }) => {
  // --- PERBAIKAN 1: Ambil semua properti yang dibutuhkan ---
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: list._id,
      data: {
        type: "List",
      },
    });
    
  // --- PERBAIKAN 3: Siapkan style untuk animasi drag ---
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      onAddCard(list._id, newCardTitle.trim());
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the list "${list.title}"? This action cannot be undone.`
      )
    ) {
      onDeleteList(list._id);
    }
    setIsMenuOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style} // 1. Tambahkan 'style' untuk animasi pergerakan
      className="bg-white/8 backdrop-blur-sm rounded-2xl w-80 flex-shrink-0 flex flex-col h-full max-h-full shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
    >
      {/* Header List - Bagian ini sekarang menjadi 'handle' untuk di-drag */}
      <div
        {...attributes} // 2. Tambahkan 'attributes' dan 'listeners'
        {...listeners}
        className="font-semibold text-white p-4 flex-shrink-0 border-b border-white/10 flex justify-between items-center cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
          <span className="text-lg font-medium">{list.title}</span>
          <span className="bg-white/20 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">
            {list.cards?.length || 0}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 z-50 animate-in slide-in-from-top-2 duration-200">
              <ul className="py-2">
                <li>
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors rounded-lg mx-2"
                  >
                    🗑️ Delete this list
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-grow p-3 min-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {/* 3. Bungkus daftar kartu dengan SortableContext */}
        <SortableContext
          items={list.cards.map((c) => c._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {list.cards.map((card) => (
              <TaskCard key={card._id} card={card} onClick={onCardClick} />
            ))}
          </div>
        </SortableContext>
      </div>

      {/* Add Card */}
      <div className="p-3 flex-shrink-0">
        {isAddingCard ? (
          <form onSubmit={handleAddCardSubmit} className="space-y-3">
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter a title for this card..."
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/20 focus:border-blue-500/50 transition-all duration-200 resize-none"
              autoFocus
              rows="3"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                ✨ Add card
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full text-left text-sm text-gray-400 hover:text-white p-3 rounded-xl hover:bg-white/10 transition-all duration-200 border-2 border-dashed border-white/20 hover:border-white/40 group"
          >
            <span className="flex items-center space-x-2">
              <span className="text-lg group-hover:scale-110 transition-transform">
                +
              </span>
              <span>Add a card</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ListColumn;

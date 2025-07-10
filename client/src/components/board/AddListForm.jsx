import React from "react";

const AddListForm = ({ isAdding, setIsAdding, title, setTitle, onSubmit }) => {
  return isAdding ? (
    <form
      onSubmit={onSubmit}
      className="bg-white/8 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-2xl"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter list title..."
        className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/20 focus:border-blue-500/50 transition-all duration-200"
        autoFocus
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
        >
          ✨ Add list
        </button>
        <button
          type="button"
          onClick={() => setIsAdding(false)}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
        >
          ✕
        </button>
      </div>
    </form>
  ) : (
    <button
      onClick={() => setIsAdding(true)}
      className="w-full p-6 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-300 hover:text-white transition-all duration-200 border-2 border-dashed border-white/20 hover:border-white/40 group backdrop-blur-sm"
    >
      <div className="flex items-center justify-center space-x-3">
        <span className="text-2xl group-hover:scale-110 transition-transform">+</span>
        <span className="text-lg font-medium">Add another list</span>
      </div>
    </button>
  );
};

export default AddListForm;

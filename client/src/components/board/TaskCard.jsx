import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({ card, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: card._id,
      data: {
        type: "Card",
        listId: card.listId,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(card)}
      className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-4 hover:bg-white/15 cursor-pointer ..."
    >
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label) => (
            <div
              key={label._id}
              className="h-2 w-10 rounded-full"
              style={{ backgroundColor: label.color }}
              title={label.name} // Tampilkan nama label saat di-hover
            ></div>
          ))}
        </div>
      )}
      <p className="text-sm text-gray-100 leading-relaxed group-hover:text-white transition-colors">
        {card.title}
      </p>
      <div className="mt-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default TaskCard;

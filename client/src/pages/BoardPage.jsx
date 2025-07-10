import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import boardService from "../services/boardService";
import { useAuth } from "../contexts/AuthContext";

// Import komponen-komponen terpisah
import ListColumn from "../components/board/ListColumn";
import AddListForm from "../components/board/AddListForm";
import CardDetailModal from "../components/modals/CardDetailModal";
import BoardMembersManager from "../components/board/BoardMembersManager";
import ActivityLog from "../components/board/ActivityLog";

const BoardDetailPage = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [activeId, setActiveId] = useState(null);

  const [selectedCard, setSelectedCard] = useState(null);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const selectedCardRef = useRef(null);

  const fetchBoardData = useCallback(async () => {
    try {
      const data = await boardService.boards.getDetails(boardId);
      const newBoard = { ...data };
      const newLists = data.lists.map((list) => ({
        ...list,
        cards: list.cards ? [...list.cards] : [],
      }));

      setBoard(newBoard);
      setLists(newLists);

      // Gunakan ref, bukan selectedCard langsung
      const currentCard = selectedCardRef.current;
      if (currentCard) {
        const freshCard = newLists
          .flatMap((list) => list.cards)
          .find((c) => c._id === currentCard._id);

        if (freshCard) {
          setSelectedCard(freshCard);
        } else {
          setSelectedCard(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch board data:", error);
      setError("Could not load board.");
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoardData();
    const intervalId = setInterval(() => {
      fetchBoardData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [fetchBoardData]);

  useEffect(() => {
    selectedCardRef.current = selectedCard;
  }, [selectedCard]);

  useEffect(() => {
    if (!user || !user.email || !boardId || !board) return;

    // Cek apakah user belum jadi member
    const isMember = board.members?.some(
      (member) => member.email === user.email
    );
    if (!isMember) {
      boardService.members
        .invite(boardId, { email: user.email }) // PENTING: kirim sebagai body
        .then(() => {
          console.log("✅ Auto-joined board as member.");
          fetchBoardData(); // refresh setelah join
        })
        .catch((err) => {
          console.error("❌ Failed to auto-join board:", err);
        });
    }
  }, [user, boardId, board]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    try {
      await boardService.lists.create(boardId, { title: newListTitle.trim() });
      setNewListTitle("");
      setIsAddingList(false);
      fetchBoardData();
    } catch (error) {
      alert("Failed to create list.", error);
    }
  };

  const handleCreateCard = async (listId, title) => {
    try {
      await boardService.cards.create(listId, { title });
      fetchBoardData();
    } catch (error) {
      alert("Failed to create card.", error);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await boardService.lists.delete(listId);
      fetchBoardData();
    } catch (error) {
      alert("Failed to delete the list.", error);
    }
  };

  const handleCloseCard = () => {
    setTimeout(() => {
      setSelectedCard(null);
    }, 50);
  };

  // --- LOGIKA UTAMA DRAG AND DROP ---
  const handleDragStart = (event) => {
    console.log("🎯 Drag started:", event.active.id);
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    console.log("🔥 handleDragEnd dipanggil");
    console.log("🎯 active", active);
    console.log("🎯 over", over);

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const activeType = active.data.current?.type;
    const activeIsList = activeType === "List";
    const activeIsCard = activeType === "Card";

    // ----------- LIST DND -----------
    if (activeIsList) {
      console.log("📋 Moving list...");
      const oldIndex = lists.findIndex((list) => list._id === active.id);
      const newIndex = lists.findIndex((list) => list._id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        setActiveId(null);
        return;
      }

      const newLists = arrayMove(lists, oldIndex, newIndex);
      setLists(newLists);

      const orderedLists = newLists.map((list, index) => ({
        _id: list._id,
        position: index,
      }));

      try {
        await boardService.dnd.updateListOrder(boardId, orderedLists);
        console.log("✅ List order updated successfully");
      } catch (error) {
        console.error("❌ Failed to update list order:", error);
        setLists(lists); // rollback UI
      }

      setActiveId(null);
      return;
    }

    // ----------- CARD DND -----------
    if (activeIsCard) {
      console.log("🃏 Moving card...");
      const updatedLists = JSON.parse(JSON.stringify(lists)); // Deep copy

      const sourceList = updatedLists.find((list) =>
        list.cards.some((c) => c._id === active.id)
      );

      const destList = updatedLists.find(
        (list) =>
          list._id === over.id || list.cards.some((c) => c._id === over.id)
      );

      if (!sourceList || !destList) {
        console.error("❌ Source or destination list not found");
        setActiveId(null);
        return;
      }

      const sourceCardIndex = sourceList.cards.findIndex(
        (c) => c._id === active.id
      );
      const [movedCard] = sourceList.cards.splice(sourceCardIndex, 1);

      let destCardIndex;
      if (over.data.current?.type === "Card") {
        destCardIndex = destList.cards.findIndex((c) => c._id === over.id);
      } else {
        // Dropping on list itself
        destCardIndex = destList.cards.length;
      }

      destList.cards.splice(destCardIndex, 0, movedCard);

      // Update UI sementara
      setLists(updatedLists);

      console.log("📦 Sending card move data:", {
        cardId: movedCard._id,
        sourceListId: sourceList._id,
        destListId: destList._id,
        oldPosition: sourceCardIndex,
        newPosition: destCardIndex,
      });

      try {
        await boardService.boards.moveCard(boardId, {
          cardId: movedCard._id,
          sourceListId: sourceList._id,
          destListId: destList._id,
          oldPosition: sourceCardIndex,
          newPosition: destCardIndex,
        });
        console.log("✅ Card moved successfully");
      } catch (error) {
        console.error("❌ Failed to move card:", error);
        fetchBoardData(); // Reload if error
      }
    }

    setActiveId(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mb-4"></div>
          <p className="text-white/70 text-lg">Loading your board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* SINGLE DndContext - Hapus yang duplicate */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Header */}
        <header className="p-6 flex justify-between items-center flex-shrink-0 border-b border-white/10 backdrop-blur-sm bg-white/5 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">📋</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {board?.title || "Board"}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMembersOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              👥 Share
            </button>
            <button
              onClick={() => setIsActivityOpen(true)}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-sm font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              📈 Activity
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-6 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent relative z-10">
          <SortableContext
            items={lists.map((l) => l._id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-start space-x-6 h-full pb-6">
              {lists.map((list) => (
                <ListColumn
                  key={list._id}
                  list={list}
                  onCardClick={setSelectedCard}
                  onAddCard={handleCreateCard}
                  onDeleteList={handleDeleteList}
                />
              ))}
              <div className="w-80 flex-shrink-0">
                <AddListForm
                  isAdding={isAddingList}
                  setIsAdding={setIsAddingList}
                  title={newListTitle}
                  setTitle={setNewListTitle}
                  onSubmit={handleCreateList}
                />
              </div>
            </div>
          </SortableContext>
        </main>

        {/* Modals */}
        {isMembersOpen && (
          <BoardMembersManager
            board={board}
            onUpdate={fetchBoardData}
            onClose={() => setIsMembersOpen(false)}
          />
        )}
        {isActivityOpen && (
          <ActivityLog
            boardId={boardId}
            onClose={() => setIsActivityOpen(false)}
          />
        )}
        {selectedCard && (
          <CardDetailModal
            card={selectedCard}
            listName={
              lists.find((l) =>
                l.cards?.some((c) => c._id === selectedCard._id)
              )?.title
            }
            board={board}
            onClose={handleCloseCard}
            onCardUpdate={fetchBoardData}
            onCardDelete={fetchBoardData}
          />
        )}
      </DndContext>
    </div>
  );
};

export default BoardDetailPage;

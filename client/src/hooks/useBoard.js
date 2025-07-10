// src/hooks/useBoard.js
import { useState, useCallback, useEffect } from 'react';
import boardService from '../services/boardService';

export const useBoard = (boardId) => {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoard = useCallback(async () => {
    try {
      setIsLoading(true);
      const boardDetails = await boardService.boards.getDetails(boardId);
      setBoard(boardDetails); // Assuming getDetails returns the full board object
      setLists(boardDetails.lists || []);
    } catch (err) {
      console.error("Failed to fetch board:", err);
      setError("Could not load the board. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    if (boardId) {
      fetchBoard();
    }
  }, [boardId, fetchBoard]);

  const handleDragEnd = useCallback(async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // Optimistic update
    const newLists = Array.from(lists);
    const sourceList = newLists.find(list => list._id === source.droppableId);
    const destList = newLists.find(list => list._id === destination.droppableId);
    const [movedCard] = sourceList.cards.splice(source.index, 1);
    destList.cards.splice(destination.index, 0, movedCard);
    setLists(newLists);

    try {
      await boardService.cards.updateOrder(boardId, {
        cardId: draggableId,
        sourceListId: source.droppableId,
        destListId: destination.droppableId,
        newIndexInDest: destination.index,
      });
    } catch (err) {
      console.error("Failed to save card move:", err);
      // Revert state on failure
      fetchBoard(); 
    }
  }, [lists, boardId, fetchBoard]);

  const addList = async (title) => {
    try {
        await boardService.lists.create(boardId, { title });
        fetchBoard(); // Refresh data
    } catch (error) {
        console.error("Failed to add list:", error);
    }
  };

  const addCard = async (listId, title) => {
    try {
        await boardService.cards.create(listId, { title });
        fetchBoard(); // Refresh data
    } catch (error) {
        console.error("Failed to add card:", error);
    }
  };
  
  const updateCardInBoard = (updatedCard) => {
    const newLists = lists.map(list => {
        const cardIndex = list.cards.findIndex(c => c._id === updatedCard._id);
        if (cardIndex > -1) {
            const newCards = [...list.cards];
            newCards[cardIndex] = updatedCard;
            return { ...list, cards: newCards };
        }
        return list;
    });
    setLists(newLists);
  };

  return {
    board,
    lists,
    isLoading,
    error,
    handleDragEnd,
    addList,
    addCard,
    fetchBoard,
    updateCardInBoard
  };
};

import apiClient from "./apiClient";

const handleError = (message, error) => {
  console.error(message, error);
  // Re-throw the error to be caught by the calling function
  throw error.response?.data || new Error(message);
};

/**
 * Service object for handling all board, list, card, and related API requests.
 * Functions are grouped by the entity they interact with (e.g., boards, lists, cards).
 */
const boardService = {
  // --- Board Management ---
  boards: {
    // Fetches all ACTIVE boards
    async getAll() {
      try {
        const response = await apiClient.get("/api/boards");
        return response.data;
      } catch (error) {
        handleError("Error fetching active boards:", error);
      }
    },

    /**
     * Fetches complete details for a single board, including its lists and cards.
     * @param {string} boardId - The ID of the board.
     * @returns {Promise<object>} An object containing the board details.
     */
    async getDetails(boardId) {
      try {
        // Langkah 1: Ambil detail board dasar & semua label yang tersedia di board ini
        const boardPromise = apiClient.get(`/api/boards/${boardId}`);
        const labelsPromise = apiClient.get(`/api/boards/${boardId}/labels`);

        // Langkah 2: Ambil semua list yang ada di board ini
        const listsPromise = apiClient.get(`/api/boards/${boardId}/lists`);

        // Jalankan semua promise di atas secara paralel
        const [boardResponse, labelsResponse, listsResponse] =
          await Promise.all([boardPromise, labelsPromise, listsPromise]);

        const boardDetails = boardResponse.data;
        boardDetails.labels = labelsResponse.data; // Simpan daftar label ke objek board

        let lists = listsResponse.data;

        // Jika tidak ada list, langsung kembalikan data board
        if (lists.length === 0) {
          return { ...boardDetails, lists: [] };
        }

        // Langkah 3: Ambil semua kartu untuk semua list secara paralel
        const cardPromises = lists.flatMap((list) =>
          apiClient.get(`/api/lists/${list._id}/cards`)
        );

        const cardHttpResponses = await Promise.all(cardPromises);
        const cardsByList = cardHttpResponses.map((res) => res.data);

        // Gabungkan kartu ke list masing-masing
        lists = lists.map((list, index) => ({
          ...list,
          cards: cardsByList[index],
        }));

        // Langkah 4: Ambil semua checklist untuk semua kartu yang ada
        const allCards = lists.flatMap((list) => list.cards);
        if (allCards.length > 0) {
          const checklistPromises = allCards.map((card) =>
            apiClient.get(`/api/cards/${card._id}/checklists`)
          );
          const checklistHttpResponses = await Promise.all(checklistPromises);
          const checklistsByCard = checklistHttpResponses.map(
            (res) => res.data
          );

          // Buat map untuk akses cepat: { cardId: [checklists] }
          const checklistsMap = allCards.reduce((acc, card, index) => {
            acc[card._id] = checklistsByCard[index];
            return acc;
          }, {});

          // Pasang checklists ke setiap objek kartu
          lists.forEach((list) => {
            list.cards.forEach((card) => {
              card.checklists = checklistsMap[card._id] || [];
            });
          });
        }

        return { ...boardDetails, lists };
      } catch (error) {
        handleError(`Error fetching details for board ${boardId}:`, error);
      }
    },

    /**
     * Creates a new board.
     * @param {{ title: string }} boardData - The data for the new board.
     * @returns {Promise<object>} The newly created board object.
     */
    async create(boardData) {
      try {
        const response = await apiClient.post("/api/boards", boardData);
        return response.data;
      } catch (error) {
        handleError("Error creating board:", error);
      }
    },

    /**
     * Updates a board's properties (e.g., title).
     * @param {string} boardId - The ID of the board to update.
     * @param {object} boardData - The data to update.
     * @returns {Promise<object>}
     */
    async update(boardId, boardData) {
      try {
        const response = await apiClient.put(
          `/api/boards/${boardId}`,
          boardData
        );
        return response.data;
      } catch (error) {
        handleError(`Error updating board ${boardId}:`, error);
      }
    },

    /**
     * Archives a board.
     * @param {string} boardId - The ID of the board to archive.
     * @returns {Promise<object>}
     */
    async archive(boardId) {
      try {
        const response = await apiClient.put(`/api/boards/${boardId}/archive`);
        return response.data;
      } catch (error) {
        handleError(`Error archiving board ${boardId}:`, error);
      }
    },

    // Fetches all ARCHIVED boards
    async getArchived() {
      try {
        const response = await apiClient.get("/api/boards/archived");
        return response.data;
      } catch (error) {
        handleError("Error fetching archived boards:", error);
      }
    },

    // Un-archives a board
    async unarchive(boardId) {
      try {
        const response = await apiClient.put(
          `/api/boards/${boardId}/unarchive`
        );
        return response.data;
      } catch (error) {
        handleError(`Error unarchiving board ${boardId}:`, error);
      }
    },

    // Permanently deletes a board
    async deletePermanently(boardId) {
      try {
        const response = await apiClient.delete(
          `/api/boards/${boardId}/permanent`
        );
        return response.data;
      } catch (error) {
        handleError(`Error permanently deleting board ${boardId}:`, error);
      }
    },

    /**
     * Fetches the activity log for a board.
     * @param {string} boardId - The ID of the board.
     * @returns {Promise<Array<object>>}
     */
    async getActivity(boardId) {
      try {
        const response = await apiClient.get(
          `/api/boards/${boardId}/activities`
        );
        return response.data;
      } catch (error) {
        handleError(`Error fetching activity for board ${boardId}:`, error);
      }
    },
    /**
     * Moves a card from one list to another or reorders within the same list
     * @param {string} boardId - The ID of the board
     * @param {object} payload - The move data
     * @returns {Promise<object>}
     */
    async moveCard(boardId, payload) {
      try {
        console.log("📤 Sending moveCard request:", payload);
        const response = await apiClient.put(
          `/api/boards/${boardId}/dnd`,
          payload
        );
        return response.data;
      } catch (error) {
        console.error("❌ Error moving card:", error.response?.data || error);
        handleError(`Error moving card on board ${boardId}:`, error);
      }
    },
    async togglePin(boardId) {
      try {
        const response = await apiClient.put(
          `/api/boards/${boardId}/toggle-pin`
        );
        return response.data;
      } catch (error) {
        handleError(`Error toggling pin for board ${boardId}:`, error);
      }
    },
  },

  // --- List Management ---
  lists: {
    /**
     * Creates a new list within a board.
     * @param {string} boardId - The ID of the parent board.
     * @param {{ title: string }} listData - The data for the new list.
     * @returns {Promise<object>}
     */
    async create(boardId, listData) {
      try {
        const response = await apiClient.post(
          `/api/boards/${boardId}/lists`,
          listData
        );
        return response.data;
      } catch (error) {
        handleError(`Error creating list in board ${boardId}:`, error);
      }
    },

    /**
     * Updates a list's properties.
     * @param {string} listId - The ID of the list to update.
     * @param {object} listData - The data to update.
     * @returns {Promise<object>}
     */
    async update(listId, listData) {
      try {
        const response = await apiClient.put(`/api/lists/${listId}`, listData);
        return response.data;
      } catch (error) {
        handleError(`Error updating list ${listId}:`, error);
      }
    },

    /**
     * Permanently deletes a list and its cards.
     * @param {string} listId - The ID of the list to delete.
     * @returns {Promise<object>}
     */
    async delete(listId) {
      // Renamed from 'archive' to 'delete'
      try {
        const response = await apiClient.delete(`/api/lists/${listId}`);
        return response.data;
      } catch (error) {
        handleError(`Error deleting list ${listId}:`, error);
      }
    },
  },

  // --- Card Management ---
  cards: {
    /**
     * Creates a new card within a list.
     * @param {string} listId - The ID of the parent list.
     * @param {{ title: string }} cardData - The data for the new card.
     * @returns {Promise<object>}
     */
    async create(listId, cardData) {
      try {
        const response = await apiClient.post(
          `/api/lists/${listId}/cards`,
          cardData
        );
        return response.data;
      } catch (error) {
        handleError(`Error creating card in list ${listId}:`, error);
      }
    },

    /**
     * Updates a card's properties.
     * @param {string} cardId - The ID of the card to update.
     * @param {object} cardData - The data to update.
     * @returns {Promise<object>}
     */
    async update(cardId, cardData) {
      try {
        const response = await apiClient.put(`/api/cards/${cardId}`, cardData);
        return response.data;
      } catch (error) {
        handleError(`Error updating card ${cardId}:`, error);
      }
    },

    /**
     * Permanently deletes a card.
     * @param {string} cardId - The ID of the card to delete.
     * @returns {Promise<object>}
     */
    async delete(cardId) {
      // Renamed from 'archive' to 'delete'
      try {
        // The endpoint remains the same, but the backend logic has changed
        const response = await apiClient.delete(`/api/cards/${cardId}`);
        return response.data;
      } catch (error) {
        handleError(`Error deleting card ${cardId}:`, error);
      }
    },

    /**
     * Archives a card.
     * @param {string} cardId - The ID of the card to archive.
     * @returns {Promise<object>}
     */
    async archive(cardId) {
      try {
        const response = await apiClient.delete(`/api/cards/${cardId}`);
        return response.data;
      } catch (error) {
        handleError(`Error archiving card ${cardId}:`, error);
      }
    },

    /**
     * Updates card order after a drag-and-drop operation.
     * @param {string} boardId - The board where the move occurred.
     * @param {object} dndData - Data describing the drag-and-drop result.
     * @returns {Promise<object>}
     */
    async updateOrder(boardId, dndData) {
      try {
        const response = await apiClient.put(
          `/api/boards/${boardId}/dnd`,
          dndData
        );
        return response.data;
      } catch (error) {
        handleError(`Error updating card order on board ${boardId}:`, error);
      }
    },

    /**
     * Menambahkan label ke sebuah kartu.
     * @param {string} cardId - ID dari kartu.
     * @param {string} labelId - ID dari label yang akan ditambahkan.
     */
    addLabel(cardId, labelId) {
      // Kita kirim labelId di dalam body sesuai controller
      return apiClient.post(`/api/cards/${cardId}/labels`, { labelId });
    },

    /**
     * Menghapus label dari sebuah kartu.
     * @param {string} cardId - ID dari kartu.
     * @param {string} labelId - ID dari label yang akan dihapus.
     */
    removeLabel(cardId, labelId) {
      return apiClient.delete(`/api/cards/${cardId}/labels/${labelId}`);
    },

    async copy(cardId) {
      return apiClient.post(`/api/cards/${cardId}/copy`);
    },
  },

  // ===================================
  // == LABEL MANAGEMENT (YANG BARU)
  // ===================================
  labels: {
    /**
     * Membuat label baru untuk sebuah board.
     */
    create(boardId, labelData) {
      return apiClient.post(`/api/boards/${boardId}/labels`, labelData);
    },
    /**
     * Memperbarui nama atau warna sebuah label.
     */
    update(labelId, labelData) {
      return apiClient.put(`/api/labels/${labelId}`, labelData);
    },
    /**
     * Menghapus sebuah label dari board secara permanen.
     */
    delete(labelId) {
      return apiClient.delete(`/api/labels/${labelId}`);
    },
  },

  // ===================================
  // == COMMENT MANAGEMENT
  // ===================================
  comments: {
    async getByCard(cardId) {
      try {
        const response = await apiClient.get(`/api/cards/${cardId}/comments`);
        return response.data ?? [];
      } catch (error) {
        handleError(`Error fetching comments for card ${cardId}:`, error);
        return [];
      }
    },
    // ----------------------------

    add(cardId, commentData) {
      return apiClient.post(`/api/cards/${cardId}/comments`, commentData);
    },
    update(commentId, commentData) {
      return apiClient.put(`/api/comments/${commentId}`, commentData);
    },
    delete(commentId) {
      return apiClient.delete(`/api/comments/${commentId}`);
    },
  },

  // ===================================
  // == CHECKLIST MANAGEMENT
  // ===================================
  checklists: {
    create(cardId, checklistData) {
      return apiClient.post(`/api/cards/${cardId}/checklists`, checklistData);
    },
    /**
     * Memperbarui judul checklist.
     */
    update(checklistId, checklistData) {
      return apiClient.put(`/api/checklists/${checklistId}`, checklistData);
    },
    delete(checklistId) {
      return apiClient.delete(`/api/checklists/${checklistId}`);
    },
    addItem(checklistId, itemData) {
      return apiClient.post(`/api/checklists/${checklistId}/items`, itemData);
    },
    updateItem(checklistId, itemId, itemData) {
      return apiClient.put(
        `/api/checklists/${checklistId}/items/${itemId}`,
        itemData
      );
    },
    deleteItem(checklistId, itemId) {
      return apiClient.delete(`/api/checklists/${checklistId}/items/${itemId}`);
    },
  },

  // ===================================
  // == DND MANAGEMENT (DIPERBAIKI)
  // ===================================
  dnd: {
    /**
     * Updates the order of lists on a board
     * @param {string} boardId - The ID of the board
     * @param {Array} orderedLists - Array of list objects with _id and position
     * @returns {Promise<object>}
     */
    async updateListOrder(boardId, orderedLists) {
      try {
        console.log("📤 Sending list order update:", { boardId, orderedLists });
        const response = await apiClient.post("/api/dnd/list", {
          boardId,
          orderedLists,
        });
        return response.data;
      } catch (error) {
        console.error(
          "❌ Error updating list order:",
          error.response?.data || error
        );
        handleError("Error updating list order:", error);
      }
    },

    /**
     * Updates card order after drag and drop
     * @param {string} boardId - The ID of the board
     * @param {object} sourceList - Source list data
     * @param {object} destList - Destination list data
     * @returns {Promise<object>}
     */
    async updateCardOrder(boardId, sourceList, destList) {
      try {
        console.log("📤 Sending card DND:", { boardId, sourceList, destList });
        const response = await apiClient.post("/api/dnd/card", {
          boardId,
          sourceList,
          destList,
        });
        return response.data;
      } catch (error) {
        console.error(
          "❌ Error updating card DND:",
          error.response?.data || error
        );
        handleError("Error updating card order:", error);
      }
    },
  },

  // --- Member Management ---
  members: {
    /**
     * Invites a user to a board.
     * @param {string} boardId - The ID of the board.
     * @param {{ email: string }} memberData - The invitee's data.
     * @returns {Promise<object>}
     */
    async invite(boardId, memberData) {
      try {
        const response = await apiClient.post(
          `/api/boards/${boardId}/members`,
          memberData
        );
        return response.data;
      } catch (error) {
        handleError(`Error inviting member to board ${boardId}:`, error);
      }
    },

    /**
     * Removes a member from a board.
     * @param {string} boardId - The ID of the board.
     * @param {string} userId - The ID of the user to remove.
     * @returns {Promise<object>}
     */
    async remove(boardId, userId) {
      try {
        const response = await apiClient.delete(
          `/api/boards/${boardId}/members/${userId}`
        );
        return response.data;
      } catch (error) {
        handleError(
          `Error removing member ${userId} from board ${boardId}:`,
          error
        );
      }
    },
  },

  // --- Activity Management ---
  activity: {
    /**
     * Fetches all activities for the authenticated user across all boards they are a member of.
     * @returns {Promise<Array<object>>}
     */
    async getAllUserActivities() {
      try {
        const response = await apiClient.get("/api/activities"); // New endpoint for global user activities
        return response.data;
      } catch (error) {
        handleError("Error fetching global user activities:", error);
      }
    },
  },
};

export default boardService;

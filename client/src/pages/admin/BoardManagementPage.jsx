import React, { useState, useEffect, useCallback, useMemo } from "react";
import adminService from "../../services/adminService";

// --- Reusable SVG Icons ---
const Icon = ({ name, className }) => {
    const icons = {
        trash: <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
        search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    };
    return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icons[name]}</svg>;
};

// --- Confirmation Modal (No Changes) ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end space-x-4 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const BoardManagementPage = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for new features
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [boardToDelete, setBoardToDelete] = useState(null); // For single or multiple deletions

  const fetchBoards = useCallback(async () => {
    try {
      setIsLoading(true);
      const boardsData = await adminService.getAllBoards();
      setBoards(boardsData);
    } catch (err) {
      setError("Failed to load boards. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // --- Filtering and Selection Logic ---
  const filteredBoards = useMemo(() => 
    boards.filter(board =>
      board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.ownerId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.ownerId?.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [boards, searchTerm]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedBoards(filteredBoards.map(b => b._id));
    } else {
      setSelectedBoards([]);
    }
  };

  const handleSelectOne = (e, boardId) => {
    if (e.target.checked) {
      setSelectedBoards(prev => [...prev, boardId]);
    } else {
      setSelectedBoards(prev => prev.filter(id => id !== boardId));
    }
  };

  // --- Deletion Logic ---
  const handleDeleteClick = (board) => {
    setBoardToDelete({ type: 'single', data: board });
  };

  const handleDeleteSelectedClick = () => {
    setBoardToDelete({ type: 'multiple', count: selectedBoards.length });
  };

  const confirmDelete = async () => {
    if (!boardToDelete) return;
    
    try {
        if (boardToDelete.type === 'single') {
            await adminService.deleteBoardAsAdmin(boardToDelete.data._id);
        } else if (boardToDelete.type === 'multiple') {
            // This service function needs to be created
            await adminService.deleteMultipleBoards(selectedBoards);
            setSelectedBoards([]); // Clear selection after deletion
        }
        fetchBoards(); // Refresh the list
    } catch (err) {
        setError(`Failed to delete board.`);
        console.error(err);
    } finally {
        setBoardToDelete(null); // Close the modal
    }
  };


  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading boards...</div>;
  if (error) return <div className="p-8 text-center text-red-500 bg-red-100 rounded-md">{error}</div>;

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Global Board Management</h1>
          <p className="mt-1 text-md text-gray-500 dark:text-gray-400">View and manage all boards across the platform.</p>
        </header>

        {/* --- Toolbar: Search and Bulk Actions --- */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-72">
                <Icon name="search" className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
                <input 
                    type="text"
                    placeholder="Search by title or owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>
            {selectedBoards.length > 0 && (
                <button 
                    onClick={handleDeleteSelectedClick}
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                    <Icon name="trash" className="h-5 w-5" />
                    <span>Delete ({selectedBoards.length}) Selected Boards</span>
                </button>
            )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 w-12">
                    <input 
                        type="checkbox"
                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        onChange={handleSelectAll}
                        checked={filteredBoards.length > 0 && selectedBoards.length === filteredBoards.length}
                        indeterminate={selectedBoards.length > 0 && selectedBoards.length < filteredBoards.length}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Board Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBoards.map((board) => (
                  <tr key={board._id} className={`transition-colors ${selectedBoards.includes(board._id) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                    <td className="px-4 py-4">
                        <input 
                            type="checkbox"
                            className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                            checked={selectedBoards.includes(board._id)}
                            onChange={(e) => handleSelectOne(e, board._id)}
                        />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{board.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div>{board.ownerId?.name || "N/A"}</div>
                        <div className="text-xs">{board.ownerId?.email || "No email"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(board.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDeleteClick(board)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" title="Delete Board">
                        <Icon name="trash" className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!boardToDelete}
        onClose={() => setBoardToDelete(null)}
        onConfirm={confirmDelete}
        title={boardToDelete?.type === 'single' ? `Delete Board: "${boardToDelete.data.title}"?` : `Delete ${boardToDelete?.count} Boards?`}
        message="Are you sure you want to permanently delete this board? This action cannot be undone and will delete all lists and cards within it."
      />
    </>
  );
};

export default BoardManagementPage;

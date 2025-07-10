// src/components/board/EditBoardModal.jsx
import React, { useState, useEffect } from 'react';
import boardService from '../../services/boardService';

const EditBoardModal = ({ isOpen, onClose, onBoardUpdated, board }) => {
    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // When the modal opens, pre-fill the title from the board prop
    useEffect(() => {
        if (board) {
            setTitle(board.title);
        }
    }, [board]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !board) return;

        setIsSaving(true);
        try {
            // Use the update service function
            await boardService.boards.update(board._id, { title });
            onBoardUpdated(); // This will close modal and refresh list
        } catch (err) {
            console.error("Failed to update board:", err);
            alert("Failed to update board.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-white">Edit Board Title</h3>
                        <div className="mt-4">
                            <label htmlFor="board-title-edit" className="sr-only">Board Title</label>
                            <input
                                type="text"
                                id="board-title-edit"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="bg-gray-700 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-600 border border-gray-500 rounded-md hover:bg-gray-500">Cancel</button>
                        <button type="submit" disabled={isSaving || !title.trim()} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBoardModal;

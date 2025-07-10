// src/components/modals/CreateBoardModal.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import boardService from '../../services/boardService';
import { Loader2 } from 'lucide-react';

const CreateBoardModal = ({ isOpen, onClose, onBoardCreated }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Board title is required.");
            return;
        }
        setIsCreating(true);
        try {
            await boardService.boards.create({ title, description });
            toast.success(`Board "${title}" created successfully!`);
            onBoardCreated(); // Memicu refresh di halaman ProjectsPage
            handleClose();
        } catch (err) {
            console.error("Failed to create board:", err);
            toast.error("Failed to create board.");
        } finally {
            setIsCreating(false);
        }
    };
    
    // Fungsi untuk mereset state saat modal ditutup
    const handleClose = () => {
        setTitle('');
        setDescription('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-fast" 
            onClick={handleClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-slide-up-fast border border-gray-200 dark:border-gray-700" 
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('modals.createBoardTitle')}</h3>
                        <div className="mt-6 space-y-5">
                            <div>
                                <label htmlFor="board-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('modals.boardTitleLabel')}</label>
                                <input 
                                    type="text" 
                                    id="board-title" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    placeholder={t('modals.boardTitlePlaceholder')} 
                                    required 
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="board-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('modals.boardDescriptionLabel')}</label>
                                <textarea 
                                    id="board-description" 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    placeholder={t('modals.boardDescriptionPlaceholder')} 
                                    rows="3" 
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                        {/* FIXED: Mengubah button cancel menjadi warna abu-abu */}
                        <button 
                            type="button" 
                            onClick={handleClose} 
                            className="inline-flex items-center justify-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            {t('modals.cancelButton')}
                        </button>
                        {/* Button create tetap biru */}
                        <button 
                            type="submit" 
                            disabled={isCreating || !title.trim()} 
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            {isCreating ? <Loader2 className="animate-spin h-5 w-5" /> : t('modals.createButton')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBoardModal;
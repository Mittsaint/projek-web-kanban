import React from 'react';
import Icon from '../icon/Icon';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/50 w-full max-w-md">
                <div className="p-6 text-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 mb-4">
                        <Icon name="warning" className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{message}</p>
                </div>
                <div className="bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm px-6 py-4 sm:flex sm:flex-row-reverse rounded-b-xl gap-3">
                    <button 
                        onClick={onConfirm} 
                        type="button" 
                        className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <Icon name="delete" className="h-4 w-4 mr-2" />
                        Delete
                    </button>
                    <button 
                        onClick={onClose} 
                        type="button" 
                        className="w-full sm:w-auto mt-3 sm:mt-0 inline-flex justify-center items-center px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-300 dark:border-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
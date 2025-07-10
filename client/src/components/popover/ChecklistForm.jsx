import React, { useState } from 'react';

const ChecklistForm = ({ onCreate, onCancel }) => {
    const [title, setTitle] = useState('');
    return (
        <div className="absolute z-20 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2 mt-2">
            <h4 className="text-xs font-bold text-center text-gray-500 dark:text-gray-400 mb-2">Add Checklist</h4>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Checklist title..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                autoFocus
            />
            <div className="flex items-center gap-2">
                <button onClick={() => onCreate(title)} className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">Add</button>
                <button onClick={onCancel} className="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
            </div>
        </div>
    );
};

export default ChecklistForm;
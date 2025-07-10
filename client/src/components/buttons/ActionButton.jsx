import React from 'react';
import Icon from '../icon/Icon'; // Impor Icon dari file barunya

const ActionButton = ({ icon, label, onClick, variant = "default", disabled = false }) => {
    const variants = {
        default: "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600",
        danger: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800",
        primary: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800"
    };
    
    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className={`w-full flex items-center justify-start px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
        >
            <Icon name={icon} className="h-5 w-5 mr-3 flex-shrink-0" />
            {label}
        </button>
    );
};

export default ActionButton;
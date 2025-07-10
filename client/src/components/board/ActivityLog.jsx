
import React, { useState, useEffect, useCallback } from 'react';
import boardService from '../../services/boardService';

const Icon = ({ path, className="h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {path}
    </svg>
);

const ActivityLog = ({ boardId, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!boardId) return;
    try {
      setIsLoading(true);
      const data = await boardService.activity.getBoardActivity(boardId);
      setActivities(data);
    } catch (err) {
      console.error("Could not load activities:", err);
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    // --- FIX: Wrapper div is now transparent ---
    // Removed 'bg-black bg-opacity-20'
    <div className="fixed inset-0 z-30" onClick={onClose}>
        <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-16 right-4 w-96 bg-gray-800 shadow-2xl rounded-lg z-40 border border-gray-700 flex flex-col max-h-[calc(100vh-5rem)]"
        >
            {/* Header Pop-up */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                <h3 className="font-semibold text-lg text-white">Activity</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            {/* Konten yang bisa di-scroll */}
            <div className="p-4 overflow-y-auto">
                {isLoading ? (
                    <p className="text-gray-400 text-center">Loading activities...</p>
                ) : activities.length === 0 ? (
                    <p className="text-gray-400 text-center">No activities found for this board.</p>
                ) : (
                    <ul className="space-y-4">
                        {activities.map(activity => (
                            <li key={activity._id} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                    <Icon path={<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />} className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-300">
                                        <span className="font-semibold text-white">{activity.userId?.name || 'Someone'}</span> {activity.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    </div>
  );
};

export default ActivityLog;

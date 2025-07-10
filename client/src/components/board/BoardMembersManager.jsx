// src/components/popovers/BoardMembersPopover.jsx
import React, { useState } from 'react';
import boardService from '../../services/boardService';

const BoardMembersPopover = ({ board, onUpdate, onClose }) => {
    const [email, setEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLink = () => {
        const boardUrl = window.location.href;
        navigator.clipboard.writeText(boardUrl).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            alert('Failed to copy link.');
        });
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setIsInviting(true);
        try {
            await boardService.members.invite(board._id, { email });
            alert(`Invitation sent to ${email}`);
            setEmail('');
            onUpdate();
        } catch (error) {
            alert('Failed to send invitation. Make sure the email is correct.', error);
        } finally {
            setIsInviting(false);
        }
    };

    return (
        // --- FIX: Wrapper to close popover on outside click ---
        <div className="fixed inset-0 z-30" onClick={onClose}>
            <div 
                onClick={(e) => e.stopPropagation()}
                // --- STYLE FIX: Matched with ActivityLog styles ---
                className="absolute top-16 right-4 w-96 bg-gray-800 shadow-2xl rounded-lg z-40 border border-gray-700 flex flex-col"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="font-semibold text-lg text-white">Share Board</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                
                <div className="p-4 space-y-6">
                    {/* Shareable Link Section */}
                    <div>
                        <label className="text-sm font-medium text-gray-300">Share Link</label>
                        <div className="flex gap-2 mt-1">
                            <input
                                type="text"
                                value={window.location.href}
                                readOnly
                                className="flex-grow p-2 rounded-md bg-gray-900 text-gray-400 text-sm border border-gray-700 focus:outline-none min-w-0" // --- LAYOUT FIX: Added min-w-0
                            />
                            <button onClick={handleCopyLink} className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-md hover:bg-gray-500 flex-shrink-0">
                                {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Invite Section */}
                    <form onSubmit={handleInvite}>
                        <label className="text-sm font-medium text-gray-300">Invite with Email</label>
                        <div className="flex gap-2 mt-1">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="flex-grow p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0" // --- LAYOUT FIX: Added min-w-0
                                required
                            />
                            <button type="submit" disabled={isInviting} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 flex-shrink-0">
                                {isInviting ? '...' : 'Send'}
                            </button>
                        </div>
                    </form>

                    {/* Members List Section */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Members ({board.members.length})</h4>
                        <ul className="space-y-2 max-h-48 overflow-y-auto">
                            {board.members.map(member => (
                                <li key={member._id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white text-sm">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{member.name}</p>
                                            <p className="text-xs text-gray-400">{member.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {board.ownerId === member._id ? 'Owner' : 'Member'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardMembersPopover;

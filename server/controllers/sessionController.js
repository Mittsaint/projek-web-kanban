// controllers/sessionController.js
const Session = require('../models/Session');

// @desc    Get all active sessions for the logged-in user
// @route   GET /api/sessions
exports.getActiveSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.user.id }).sort({ lastActive: -1 });
        
        // Ekstrak token dari header untuk menandai sesi saat ini
        const currentToken = req.headers.authorization?.split(' ')[1];

        const formattedSessions = sessions.map(session => {
            const deviceString = `${session.device.browser} on ${session.device.os}`;
            return {
                id: session._id,
                location: session.location,
                device: deviceString,
                lastActive: session.lastActive,
                isCurrent: session.token === currentToken // Tandai jika ini adalah sesi saat ini
            };
        });

        res.json(formattedSessions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Log out a specific session by its ID
// @route   DELETE /api/sessions/:id
exports.logoutSession = async (req, res) => {
    try {
        const sessionId = req.params.id;
        // Hapus sesi HANYA jika sessionId tersebut milik user yang sedang login
        const result = await Session.deleteOne({ _id: sessionId, userId: req.user.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Session not found or not authorized to delete' });
        }
        
        res.json({ message: 'Session logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
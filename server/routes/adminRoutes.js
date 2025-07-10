const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Apply security middleware to all routes in this file
router.use(protect, isAdmin);

// --- Statistics Routes ---
// GET /api/admin/stats
// GET /api/admin/stats/user-growth
router.get("/stats", adminController.getAppStats);
router.get("/stats/user-growth", adminController.getUserGrowthStats);

// --- Global Board Management Routes ---
// GET    /api/admin/boards
// DELETE /api/admin/boards
// DELETE /api/admin/boards/:id
router.get("/boards", adminController.getAllBoardsAdmin);
router.delete("/boards", adminController.deleteMultipleBoardsAdmin);
router.delete("/boards/:id", adminController.deleteBoardAdmin);

// --- Global User Management Routes (from admin panel) ---
// GET    /api/admin/users
// DELETE /api/admin/users
// DELETE /api/admin/users/:id
router.get("/users", adminController.getAllUsersAdmin); // Assuming this function exists or will be created
router.delete("/users", adminController.deleteMultipleUsersAdmin);
router.delete("/users/:id", adminController.deleteUserAdmin); // Assuming this function exists or will be created


module.exports = router;
// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // Import multer middleware

// =======================================================
// == ROUTES FOR LOGGED-IN USERS (ALL ROLES)            ==
// =======================================================

// Ensure this route is above router.use(isAdmin)
// Added the 'upload' middleware to handle file upload
router.route("/profile")
  .put(protect, upload, userController.updateUserProfile); // Use upload middleware here

// Ensure this route is also above router.use(isAdmin)
router.route("/change-password")
  .put(protect, userController.changeUserPassword);

router.route("/me").delete(protect, userController.deleteOwnAccount);

router.route("/profile")

router.route("/me").delete(protect, userController.deleteOwnAccount);

router.route("/blocked").get(protect, userController.getBlockedUsers);
router.route("/unblock").post(protect, userController.unblockUser);
// ============================================
// ===== ADMIN-ONLY ROUTES (BELOW HERE) =====
// ============================================

// The 'isAdmin' middleware will only apply to routes defined AFTER this line
router.use(protect, isAdmin);

// Routes below are now accessible only by Admins
router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUserById)
  .put(userController.updateUsers)
  .delete(userController.deleteUser);

module.exports = router;
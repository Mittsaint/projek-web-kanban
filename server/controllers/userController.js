// controllers/userController.js
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// =======================================================
// == FUNGSI UNTUK ADMIN (MEMERLUKAN MIDDLEWARE isAdmin) ==
// =======================================================

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error getting all users:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error(`Error getting user by ID ${req.params.id}:`, error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update User (oleh Admin)
exports.updateUsers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      // ... Anda bisa menambahkan field lain yang bisa diubah admin
      
      const updatedUser = await user.save();

      // Kirim kembali data yang sudah diupdate
      const responseUser = updatedUser.toObject();
      delete responseUser.password;
      res.json(responseUser);

    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user (admin):", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a User (oleh Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error(`Error deleting user by ID ${req.params.id}:`, error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


// =================================================================
// == FUNGSI UNTUK PENGGUNA YANG LOGIN (TIDAK PERLU ADMIN)        ==
// =================================================================

// Update profile for the logged-in user
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.gender = req.body.gender || user.gender;

      if (req.body.socialLinks) {
        const socialLinks = JSON.parse(req.body.socialLinks);
        user.socialLinks.website = socialLinks.website ?? user.socialLinks.website;
        user.socialLinks.github = socialLinks.github ?? user.socialLinks.github;
        user.socialLinks.twitter = socialLinks.twitter ?? user.socialLinks.twitter;
      }

      if (req.file) {
        user.profilePictureUrl = `/${req.file.path.replace(/\\/g, "/")}`;
      }

      const updatedUser = await user.save();
      
      // --- PERBAIKAN UTAMA DI SINI ---
      // Buat token baru yang LENGKAP dengan semua data terbaru
      const token = generateToken(updatedUser); 

      // Kirim kembali data lengkap beserta token baru
      const userInfo = { ...updatedUser.toObject(), token };
      delete userInfo.password;

      res.json(userInfo);

    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Change user's own password
exports.changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Invalid current password" });
    }
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- FUNGSI BARU DITAMBAHKAN UNTUK HALAMAN PRIVACY ---

// Delete the logged-in user's own account
exports.deleteOwnAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.deleteOne();
        res.json({ message: "Your account has been permanently deleted." });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get the logged-in user's blocked list
exports.getBlockedUsers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('blockedUsers', 'name profilePictureUrl');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.blockedUsers);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Unblock a user
exports.unblockUser = async (req, res) => {
    const { userIdToUnblock } = req.body;
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { blockedUsers: userIdToUnblock }
        });
        res.json({ message: "User unblocked successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
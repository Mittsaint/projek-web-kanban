// controllers/authController.js
const User = require("../models/User");
const Session = require("../models/Session");
const generateToken = require("../utils/generateToken");
const useragent = require("useragent");
const geoip = require("geoip-lite");

// ... (fungsi registerUser & loginUser disesuaikan)
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password, provider: 'local' });
    await user.save();

    const token = generateToken(user); // <-- Disederhanakan
    const userInfo = { ...user.toObject(), token };
    delete userInfo.password; // Hapus password dari respons

    res.status(201).json(userInfo);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ msg: "Invalid credentials" }); // ubah ke 401
    }

    const token = generateToken(user);
    const userInfo = { ...user.toObject(), token };
    delete userInfo.password;

    // ✅ Tambahkan logika pencatatan sesi
    const agent = useragent.parse(req.headers['user-agent']);
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      "Unknown IP";
    const geo = geoip.lookup(ip);

    const newSession = new Session({
      userId: user._id,
      token,
      ipAddress: ip,
      location: geo ? `${geo.city}, ${geo.country}` : "Unknown",
      device: {
        browser: agent.toAgent(),
        os: agent.os.toString(),
        platform: agent.device.toString(),
      },
    });

    await newSession.save();

    res.status(200).json(userInfo);
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).send("Server Error");
  }
};



// @desc    Handles the callback after Google has authenticated the user
// @route   GET /api/auth/google/callback
exports.googleLoginCallback = async (req, res) => {
  const user = req.user;

  try {
    // --- PERBAIKAN UTAMA DI SINI ---
    const token = generateToken(user); // <-- Disederhanakan dan sekarang KONSISTEN

    // Buat objek userInfo yang akan dikirim ke frontend
    const userInfo = { ...user.toObject(), token };
    delete userInfo.password;
    
    // Logika untuk mencatat sesi (tetap sama)
    const agent = useragent.parse(req.headers['user-agent']);
    const ip = req.ip || req.connection.remoteAddress || 'Unknown IP';
    const geo = geoip.lookup(ip);
    const newSession = new Session({ userId: user._id, token, ipAddress: ip, location: geo ? `${geo.city}, ${geo.country}`: 'Unknown', device: { browser: agent.toAgent(), os: agent.os.toString(), platform: agent.device.toString() }});
    await newSession.save();

    // Kirim skrip ke jendela popup
    res.send(`
      <script>
        window.opener.postMessage(${JSON.stringify(userInfo)}, '*');
        window.close();
      </script>
    `);
  } catch (error) {
    console.error("Error during Google login callback:", error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};
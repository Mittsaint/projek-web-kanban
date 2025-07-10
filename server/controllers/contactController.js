// controllers/contactController.js
const sendEmailUtility = require('../utils/sendEmail');

exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    // Logika untuk mengirim email
    await sendEmailUtility({
      to: 'help.boardly@gmail.com',
      subject: `Pesan Baru dari ${name}`,
      text: `Anda menerima pesan dari: ${email}\n\n${message}`,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
};
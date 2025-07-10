// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmailUtility = async (options) => {
  // 1. Buat transporter (layanan pengirim email)
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // atau layanan lain
    auth: {
      user: process.env.EMAIL_USERNAME, // dari file .env
      pass: process.env.EMAIL_PASSWORD, // dari file .env
    },
  });

  // 2. Tentukan opsi email
  const mailOptions = {
    from: 'Your App Name <no-reply@yourapp.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  // 3. Kirim email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmailUtility;
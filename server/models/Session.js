// models/Session.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    // Menghubungkan sesi ini dengan user tertentu
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // Token yang digunakan untuk sesi ini
    token: {
        type: String,
        required: true,
        unique: true
    },
    // Informasi perangkat dari User-Agent
    device: {
        browser: { type: String },
        os: { type: String },
        platform: { type: String }
    },
    // Informasi lokasi dari IP
    ipAddress: {
        type: String,
        required: true
    },
    location: {
        type: String, // Contoh: "Jakarta, Indonesia"
    },
    // Waktu terakhir sesi ini aktif
    lastActive: {
        type: Date,
        default: Date.now
    },
}, { timestamps: { createdAt: 'loginTime' } }); // `createdAt` akan menjadi waktu login

module.exports = mongoose.model('Session', SessionSchema);
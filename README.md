# 📌 Boardly — Kanban-Based Task Management App

[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)](https://www.mongodb.com/)
[![Hosted on Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com/)
[![Hosted on Railway](https://img.shields.io/badge/Backend-Railway-blueviolet?logo=railway)](https://railway.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Boardly** adalah aplikasi manajemen tugas berbasis metode **Kanban**, dirancang khusus untuk mempermudah kolaborasi tim, pelacakan progres kerja, dan pengarsipan tugas. Terinspirasi dari Trello, aplikasi ini dibangun menggunakan stack **MERN** dan menerapkan arsitektur RESTful API modern dengan autentikasi Google terintegrasi.

---

## 🧩 Fitur Utama

* 👤 **Login & Autentikasi** (via akun lokal & Google OAuth)
* 🗂️ **Multi-board & Multi-user** (Admin, Owner, Member)
* 🪄 **Drag & Drop** tugas antar list dengan react-beautiful-dnd
* 📝 **Checklist, label, deadline, komentar, dan lampiran**
* 🔍 **Filter, pencarian, dan log aktivitas board**
* 📦 **Arsip board, list, dan kartu**
* 📊 **Panel Admin** untuk kelola pengguna dan statistik aplikasi

---

## 🚀 Teknologi yang Digunakan

### Frontend (React) — Hosted on **Vercel**

* **React.js** (SPA)
* **React Router DOM**
* **Context API / Redux**
* **Axios**
* **react-beautiful-dnd**
* **TailwindCSS**
  
### Backend (Express) — Hosted on **Railway**

* **Node.js + Express.js**
* **RESTful API**
* **JWT + Passport.js (Google OAuth)**
* **Mongoose (MongoDB ODM)**
* **Middleware: Auth, Role-based access**
* **Libraries**: bcryptjs, cors, dotenv, express-session

### Database

* **MongoDB Atlas**

---

## 📁 Struktur Proyek

```plaintext
boardly/
├── client/            # React Frontend (hosted on Vercel)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.jsx
│   └── public/
├── server/            # Express Backend (hosted on Railway)
│   ├── config/        # Konfigurasi MongoDB, Passport.js
│   ├── controllers/   # Logika bisnis per model
│   ├── middleware/    # JWT Auth, Role Check
│   ├── models/        # Skema MongoDB (User, Board, Card, List)
│   ├── routes/        # API Routes terpisah per fitur
│   ├── utils/         # Helper (logger, etc)
│   └── index.js       # Entry point
└── README.md
```

---

## 🌐 Arsitektur Aplikasi

* **SPA (Single Page Application)** dengan React
* **Backend API-Driven** — semua interaksi data via REST API
* **Google OAuth 2.0** + JWT untuk autentikasi aman
* **Role-based Access Control** (Admin, Owner, Member)

---

## 📌 Daftar Endpoint API (Ringkasan)

| Method | Endpoint                            | Deskripsi                     | Akses       |
| ------ | ----------------------------------- | ----------------------------- | ----------- |
| POST   | `/api/auth/register`                | Registrasi akun lokal         | Publik      |
| POST   | `/api/auth/login`                   | Login akun lokal              | Publik      |
| GET    | `/api/auth/google`                  | Mulai login dengan Google     | Publik      |
| GET    | `/api/auth/google/callback`         | Callback setelah Google login | Publik      |
| GET    | `/api/boards`                       | Ambil semua board pengguna    | Terproteksi |
| POST   | `/api/boards`                       | Buat board baru               | Terproteksi |
| PUT    | `/api/boards/:id`                   | Edit judul board              | Owner       |
| DELETE | `/api/boards/:id`                   | Arsipkan board                | Owner       |
| POST   | `/api/cards/:id/comments`           | Tambah komentar ke kartu      | Terproteksi |
| PUT    | `/api/boards/:id/dnd`               | Tangani logika drag & drop    | Terproteksi |
| ...    | Dan banyak lagi (lihat dokumen API) |                               |             |

---

## 🛠️ Cara Menjalankan Lokal

```bash
# 1. Kloning repositori
git clone https://github.com/username/boardly-kanban.git
cd boardly-kanban

# 2. Jalankan backend
cd server
npm install
npm run dev

# 3. Jalankan frontend
cd ../client
npm install
npm run dev
```

**Pastikan MongoDB Atlas URI dan Google OAuth disetting di file `.env` backend.**

---

## 🔐 .env Contoh (server)

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
CLIENT_URL=http://localhost:5173
```

---

## 👥 Peran Pengguna

* **Admin**: Mengelola semua pengguna dan board
* **Owner**: Membuat dan mengelola board sendiri
* **Member**: Berkontribusi di board yang diundang

---

## 📜 Lisensi

Proyek ini menggunakan [MIT License](https://opensource.org/licenses/MIT) — bebas digunakan, dikembangkan, dan dimodifikasi.

---

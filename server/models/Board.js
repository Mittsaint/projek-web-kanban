const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isArchived: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  // Penting: tambahkan ini agar virtuals disertakan saat JSON/Object dikonversi
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Tambahkan definisi virtual untuk 'lists'
BoardSchema.virtual('lists', {
  ref: 'List', // Nama model yang akan direferensikan (nama model 'List' Anda)
  localField: '_id', // Field di model Board yang akan dicocokkan
  foreignField: 'boardId' // Field di model List yang mereferensikan _id dari Board
});

module.exports = mongoose.model("Board", BoardSchema);
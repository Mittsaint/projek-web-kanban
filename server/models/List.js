const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// --- List Schema ---
const ListSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  // Tambahkan ini untuk memastikan virtuals disertakan saat JSON/Object dikonversi
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Tambahkan definisi virtual untuk 'cards'
ListSchema.virtual('cards', {
  ref: 'Card', // Nama model yang akan direferensikan (nama model 'Card' yang Anda definisikan)
  localField: '_id', // Field di model List yang akan dicocokkan
  foreignField: 'listId' // Field di model Card yang mereferensikan _id dari List
});

module.exports = mongoose.model("List", ListSchema);
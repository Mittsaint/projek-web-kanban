const Checklist = require("../models/Checklist");
const ChecklistItem = require("../models/ChecklistItem");

// @desc    Create a new checklist on a card
// @route   POST /api/cards/:cardId/checklists
exports.createChecklist = async (req, res) => {
  const { title } = req.body;
  const { cardId } = req.params;
  try {
    const checklistCount = await Checklist.countDocuments({ cardId });
    const checklist = await Checklist.create({
      title,
      cardId,
      position: checklistCount,
    });
    res.status(201).json(checklist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all checklists for a card (including items)
// @route   GET /api/cards/:cardId/checklists
exports.getChecklistsByCard = async (req, res) => {
  try {
    const checklists = await Checklist.find({ cardId: req.params.cardId }).sort("position");
    
    // --- PENDEKATAN BARU YANG LEBIH ROBUST ---
    const checklistsWithItems = [];
    for (const checklist of checklists) {
      const items = await ChecklistItem.find({ checklistId: checklist._id }).sort("position");
      // Gabungkan checklist dengan item-itemnya
      checklistsWithItems.push({ ...checklist.toObject(), items });
    }

    res.json(checklistsWithItems);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};
// @desc    Add an item to a checklist
// @route   POST /api/checklists/:checklistId/items
exports.addChecklistItem = async (req, res) => {
  const { text } = req.body;
  const { checklistId } = req.params;
  try {
    const itemCount = await ChecklistItem.countDocuments({ checklistId });
    const item = await ChecklistItem.create({
      text,
      checklistId,
      position: itemCount,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update a checklist item (e.g., check/uncheck)
// @route   PUT /api/checklists/:checklistId/items/:itemId
exports.updateChecklistItem = async (req, res) => {
  const { text, isCompleted } = req.body;
  try {
    const item = await ChecklistItem.findByIdAndUpdate(
      req.params.itemId,
      { text, isCompleted },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete a checklist and all its items
// @route   DELETE /api/checklists/:checklistId
exports.deleteChecklist = async (req, res) => {
  try {
    const { checklistId } = req.params;
    // Hapus semua item yang terkait dengan checklist ini terlebih dahulu
    await ChecklistItem.deleteMany({ checklistId });
    // Kemudian hapus checklistnya
    await Checklist.findByIdAndDelete(checklistId);
    res.json({ msg: "Checklist and its items deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete a checklist item
// @route   DELETE /api/checklists/:checklistId/items/:itemId
exports.deleteChecklistItem = async (req, res) => {
  try {
    await ChecklistItem.findByIdAndDelete(req.params.itemId);
    res.json({ msg: "Checklist item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
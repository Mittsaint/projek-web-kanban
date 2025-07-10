// src/components/modals/CardDetailModal.jsx
import React, { useState } from "react";
import boardService from "../../services/boardService";
// import { useAuth } from "../../hooks/useAuth";
import Icon from "../icon/Icon";
import ActionButton from "../buttons/ActionButton";
import ConfirmationModal from "./ConfirmationModal";
import LabelPopover from "../popover/LabelPopover";
import ChecklistForm from "../popover/ChecklistForm";
import ChecklistView from "../board/ChecklistView";
import ActivitySection from "../board/ActivitySection";

const CardDetailModal = ({
  card,
  listName,
  board,
  onClose,
  onCardUpdate,
  onCardDelete,
}) => {
  // All state and handler functions remain here
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isLabelPopoverOpen, setIsLabelPopoverOpen] = useState(false);
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [descriptionText, setDescriptionText] = useState(
    card.description || ""
  );
  // Handler untuk update kartu (deskripsi)
  const handleRequestDeleteChecklist = (checklistId, checklistTitle) => {
    setItemToDelete({
      type: "Checklist",
      id: checklistId,
      title: checklistTitle,
    });
  };

  // Handler untuk menambah/menghapus label
  const handleLabelToggle = async (labelId, shouldAdd) => {
    try {
      if (shouldAdd) {
        await boardService.cards.addLabel(card._id, labelId);
      } else {
        await boardService.cards.removeLabel(card._id, labelId);
      }
      onCardUpdate();
    } catch (error) {
      console.error("Failed to update label:", error);
    }
  };

  const handleSaveDescription = async () => {
    try {
      // Pastikan service Anda mengembalikan data kartu yang sudah diupdate
      const updatedCard = await boardService.cards.update(card._id, {
        description: descriptionText,
      });
      // Kirim data baru ke parent, jangan panggil fetch ulang dari sini
      onCardUpdate(updatedCard);
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Failed to save description:", error);
    }
  };

  const handleCopyCard = async () => {
    try {
      await boardService.cards.copy(card._id);
      // Panggil onCardUpdate (yang sekarang adalah fetchBoardData) untuk refresh board
      onCardUpdate();
      // Tutup modal setelah berhasil copy agar tidak membingungkan
      onClose();
    } catch (error) {
      console.error("Failed to copy card:", error);
      alert("Failed to copy card.");
    }
  };

  // --- Handler untuk Delete Card ---
  const confirmDeleteCard = async () => {
    try {
      await boardService.cards.delete(card._id);
      // Panggil onCardDelete (yang sekarang adalah fetchBoardData) untuk refresh board
      onCardDelete();
      onClose(); // onClose sudah otomatis menutup modal konfirmasi dan modal utama
    } catch (err) {
      console.error("Failed to delete card:", err);
      alert("Failed to delete card.");
    }
  };

  // Handler untuk membuat checklist baru
  const handleCreateChecklist = async (title) => {
    if (!title.trim()) return;
    try {
      await boardService.checklists.create(card._id, { title });
      onCardUpdate();
      setIsAddingChecklist(false);
    } catch (error) {
      console.error("Failed to create checklist:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "Card") {
        await boardService.cards.delete(itemToDelete.id);
        onCardDelete(itemToDelete.id); // Kirim ID kartu yang dihapus ke parent
        onClose(); // Tutup modal utama
      } else if (itemToDelete.type === "Checklist") {
        await boardService.checklists.delete(itemToDelete.id);
        onCardUpdate(); // Minta parent untuk refresh data kartu
      }
    } catch (error) {
      console.error(`Failed to delete ${itemToDelete.type}:`, error);
    } finally {
      setItemToDelete(null); // Tutup modal konfirmasi
    }
  };
  if (!card) return null;

  return (
    <>
      {/* Modal konfirmasi sekarang dikontrol dari sini */}
      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${itemToDelete?.type}`}
        message={`Are you sure you want to permanently delete the ${itemToDelete?.type.toLowerCase()} "${
          itemToDelete?.title
        }"?`}
      />
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex justify-center items-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/50 w-full max-w-5xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Modal */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center min-w-0">
              <Icon
                name="title"
                className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0"
              />
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {card.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  in list{" "}
                  <span className="font-medium">{listName || "..."}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
            >
              <Icon name="x-mark" className="h-6 w-6" />
            </button>
          </div>

          {/* Konten Utama & Sidebar */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Kolom Konten Utama (Kiri) */}
              <div className="flex-1 space-y-8">
                {/* Tampilan Labels */}
                {card.labels && card.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {card.labels.map((label) => (
                      <span
                        key={label._id}
                        style={{ backgroundColor: label.color }}
                        className="px-3 py-1 text-xs font-bold text-white rounded-full"
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bagian Deskripsi */}
                <div>
                  <div className="flex items-center mb-2">
                    <Icon
                      name="description"
                      className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-3"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Description
                    </h3>
                  </div>
                  <div className="ml-8">
                    {isEditingDescription ? (
                      <div className="space-y-2">
                        <textarea
                          value={descriptionText}
                          onChange={(e) => setDescriptionText(e.target.value)}
                          className="w-full h-32 p-3 bg-white dark:bg-gray-800 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Add a more detailed description..."
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSaveDescription}
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditingDescription(false)}
                            className="px-4 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsEditingDescription(true)}
                        className="min-h-[50px] p-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      >
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {card.description || (
                            <span className="italic text-gray-400">
                              No description provided. Click to add one...
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bagian Checklist */}
                {card.checklists &&
                  card.checklists.map((checklist) => (
                    <ChecklistView
                      key={checklist._id}
                      checklist={checklist}
                      onUpdate={onCardUpdate}
                      onDeleteRequest={handleRequestDeleteChecklist} // <-- Kirim fungsi baru sebagai prop
                      Icon={Icon}
                    />
                  ))}

                {/* Bagian Activity */}
                {/* ... Di sini Anda bisa menambahkan komponen Activity/Comment ... */}
              </div>

              {/* Kolom Sidebar Aksi (Kanan) */}
              <div className="w-full lg:w-64 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    ADD TO CARD
                  </h3>
                  <div className="space-y-2">
                    <div className="relative">
                      <ActionButton
                        icon="label"
                        label="Labels"
                        onClick={() => setIsLabelPopoverOpen((p) => !p)}
                      />
                      {isLabelPopoverOpen && (
                        <LabelPopover
                          card={card}
                          boardLabels={board.labels}
                          onUpdate={onCardUpdate}
                          onClose={() => setIsLabelPopoverOpen(false)}
                        />
                      )}
                    </div>
                    <div className="relative">
                      <ActionButton
                        icon="checklist"
                        label="Checklist"
                        onClick={() => setIsAddingChecklist((p) => !p)}
                      />
                      {isAddingChecklist && (
                        <ChecklistForm
                          onCreate={handleCreateChecklist}
                          onCancel={() => setIsAddingChecklist(false)}
                        />
                      )}
                      <ActivitySection cardId={card._id} />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    ACTIONS
                  </h3>
                  <div className="space-y-2">
                    <ActionButton
                      icon="copy"
                      label="Copy"
                      onClick={handleCopyCard} // <-- Hubungkan ke fungsi baru
                      disabled={false} // Aktifkan tombolnya
                    />
                    <ActionButton
                      icon="delete"
                      label="Delete"
                      // onClick sekarang memanggil confirmDeleteCard, bukan lagi membuka modal lain
                      onClick={confirmDeleteCard}
                      variant="danger"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardDetailModal;

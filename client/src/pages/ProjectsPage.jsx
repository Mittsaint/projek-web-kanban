// Final cleaned-up ProjectsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import boardService from "../services/boardService";
import CreateBoardModal from "../components/modals/CreateBoardModal";
import BoardCard from "../components/board/BoardCard";
import { Plus, FolderKanban } from "lucide-react";

const ProjectsPage = () => {
  const { t } = useTranslation();
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBoards = useCallback(async () => {
    try {
      const data = await boardService.boards.getAll();
      setBoards(data);
    } catch (error) {
      console.error("Failed to fetch boards:", error);
      toast.error("Could not load your projects.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const renderContent = () => {
    if (isLoading)
      return <p className="text-center py-10">{t("projectsPage.loading")}</p>;

    if (boards.length === 0) {
      return (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-700 animate-fade-in">
          <FolderKanban className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            {t("projectsPage.noProjectsTitle")}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("projectsPage.noProjectsDescription")}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg shadow-lg transition-all"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            {t("projectsPage.createNewBoard")}
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map((board, index) => (
          <div
            key={board._id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <BoardCard board={board} onRefresh={fetchBoards} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBoardCreated={fetchBoards}
      />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t("projectsPage.pageTitle")}
            </h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              {t("projectsPage.pageDescription")}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg shadow-lg transition-all"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            {t("projectsPage.createNewBoard")}
          </button>
        </div>

        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </section>
    </>
  );
};

export default ProjectsPage;

// Final cleaned-up UserDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import boardService from '../../services/boardService';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

import BoardCard from '../../components/board/BoardCard';
import CreateBoardModal from '../../components/modals/CreateBoardModal';
import { Plus, Search, LayoutTemplate, FolderKanban, Sparkles, Zap } from 'lucide-react';

const TemplateCard = ({ icon, title, description, onClick, delay = 0 }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800/80 p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-500 animate-fade-in-up backdrop-blur-sm"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-4">
      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 p-3 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="bg-white dark:bg-gray-800/50 rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    ))}
  </div>
);

const UserDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const fetchBoards = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await boardService.boards.getAll();
      setBoards(data.slice(0, 4));
    } catch (err) {
      toast.error("Failed to load projects.", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchBoards(); }, [fetchBoards]);

  const handleCreateBoard = async (boardData) => {
    try {
      await boardService.boards.create(boardData);
      toast.success(`Board "${boardData.title}" created!`);
      fetchBoards();
    } catch (error) {
      toast.error("Failed to create board.", error);
    }
  };

  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

 return (
    <>
      <CreateBoardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onBoardCreated={handleCreateBoard} />

      <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 space-y-16">
        {/* Hero Section */}
        <section className="text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('homePage.welcomeTitle', { userName: user?.name || 'User' })}
            </h1>
            <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
          </div>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in-up">
            {t('homePage.welcomeDescription')}
          </p>

          <div className="mt-8 max-w-lg mx-auto relative animate-fade-in-up">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('homePage.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full py-3 pl-12 pr-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none backdrop-blur-sm shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="animate-fade-in-up">
          {isLoading ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('homePage.allYourProjects')}</h2>
              </div>
              <LoadingSkeleton />
            </>
          ) : boards.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FolderKanban className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  {t('homePage.allYourProjects')}
                </h2>
                <Link to="/projects" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  {t('homePage.viewAllProjects')} <Zap className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBoards.map((board, index) => (
                  <BoardCard key={board._id} board={board} index={index} onRefresh={fetchBoards} />
                ))}
              </div>
              {filteredBoards.length === 0 && searchTerm && (
                <div className="text-center py-12 animate-fade-in-up">
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No projects found matching "{searchTerm}"
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 px-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 animate-pulse-in backdrop-blur-sm">
              <FolderKanban className="mx-auto h-16 w-16 text-gray-400 mb-4 animate-bounce" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {t('homePage.noBoardsTitle')}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {t('homePage.noBoardsDescription')}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" /> {t('homePage.createFirstBoard')}
              </button>
            </div>
          )}
        </section>

        {/* Templates Section */}
        <section className="animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <LayoutTemplate className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              {t('homePage.templatesTitle')}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {t('homePage.templatesDescription')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <TemplateCard icon={<LayoutTemplate className="h-6 w-6 text-blue-600 dark:text-blue-400" />} title={t('homePage.kanbanTemplateTitle')} description={t('homePage.kanbanTemplateDescription')} onClick={() => setIsModalOpen(true)} delay={0} />
            <TemplateCard icon={<LayoutTemplate className="h-6 w-6 text-green-600 dark:text-green-400" />} title={t('homePage.projectTrackerTemplateTitle')} description={t('homePage.projectTrackerTemplateDescription')} onClick={() => setIsModalOpen(true)} delay={100} />
          </div>
        </section>
      </div>
    </>
  );
};

export default UserDashboard;

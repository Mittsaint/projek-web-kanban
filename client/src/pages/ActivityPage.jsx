// src/pages/ActivityPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import boardService from "../services/boardService";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import Icon from "../components/icon/Icon";

// --- Komponen kecil untuk satu item aktivitas ---
const ActivityItem = ({ activity, index }) => {
  const actionIcons = {
    CREATE_CARD: 'plus-circle',
    MOVE_CARD: 'arrow-right-circle',
    CREATE_COMMENT: 'chat-bubble-left-right',
    UPDATE_BOARD: 'pencil-square',
    ARCHIVE_BOARD: 'archive-box-arrow-down',
    DEFAULT: 'information-circle'
  };
  const iconName = actionIcons[activity.actionType] || actionIcons.DEFAULT;

  return (
    <Link
      to={`/board/${activity.boardId}`}
      className="relative group flex items-start gap-4 px-4 py-3 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 border border-gray-200 dark:border-gray-700 opacity-0 animate-fade-in"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Timeline dot */}
      <span className="absolute -left-3 top-4 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-md"></span>

      {/* Icon */}
      <div className="mt-1">
        <Icon name={iconName} className="h-6 w-6 text-blue-500 dark:text-blue-400" />
      </div>

      {/* Deskripsi */}
      <div className="flex-1">
        <p
          className="text-sm text-gray-700 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: activity.description }}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
        </p>
      </div>
    </Link>
  );
};

// --- Komponen Utama Halaman Aktivitas ---
const ActivityPage = () => {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await boardService.activity.getAllUserActivities();
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Failed to load activities.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Logika untuk mengelompokkan aktivitas berdasarkan tanggal
  const groupedActivities = useMemo(() => {
    if (!activities) return {};
    return activities.reduce((acc, activity) => {
      const activityDate = new Date(activity.createdAt);
      let dateGroup;

      if (isToday(activityDate)) {
        dateGroup = t("activityPage.groupBy.today");
      } else if (isYesterday(activityDate)) {
        dateGroup = t("activityPage.groupBy.yesterday");
      } else {
        dateGroup = format(activityDate, "MMMM d, yyyy");
      }

      if (!acc[dateGroup]) {
        acc[dateGroup] = [];
      }
      acc[dateGroup].push(activity);
      return acc;
    }, {});
  }, [activities, t]);

  const renderContent = () => {
    if (isLoading)
      return (
        <p className="text-gray-400 text-center animate-pulse">
          {t("activityPage.loading")}
        </p>
      );
    if (error) return <p className="text-red-400 text-center">{error}</p>;

    if (Object.keys(groupedActivities).length === 0) {
      return (
        <div className="text-center bg-white dark:bg-gray-800/50 p-10 rounded-xl shadow-sm animate-fade-in">
          <Icon name="activity" className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            {t("activityPage.noActivityTitle")}
          </h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {t("activityPage.noActivityDescription")}
          </p>
        </div>
      );
    }

    return (
      <div className="relative pl-6 border-l border-gray-200 dark:border-gray-700 animate-fade-in space-y-10">
        {Object.keys(groupedActivities).map((dateGroup) => (
          <div key={dateGroup}>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              {dateGroup}
            </h2>
            <div className="space-y-3">
              {groupedActivities[dateGroup].map((activity, index) => (
                <ActivityItem
                  key={activity._id}
                  activity={activity}
                  index={index}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Activity</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default ActivityPage;

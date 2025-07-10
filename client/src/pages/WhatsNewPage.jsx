// src/pages/WhatsNewPage.jsx
import React from 'react';

// A checkmark icon component styled to match the new dark theme
const FeatureIcon = () => (
  <svg
    className="w-6 h-6 mr-4 text-blue-500 flex-shrink-0 mt-1"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const WhatsNewPage = () => {
  return (
    <div className="w-full flex flex-col flex-grow p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-0">
      <div className="max-w-4xl mx-auto w-full">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            What's New
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Discover the latest features, improvements, and updates we've made.
          </p>
        </header>

        {/* Timeline container for updates */}
        <div className="space-y-12">
          {/* Release Version 1.0.0 */}
          <article className="bg-gray-800 rounded-2xl p-8 sm:p-10 border border-gray-700/50">
            {/* Article Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-2xl font-bold text-white">
                Version 1.0.0 - Initial Launch!
              </h2>
              <p className="mt-2 sm:mt-0 text-sm font-medium text-gray-400">
                Released on July 8, 2025
              </p>
            </div>
            <div className="border-b border-gray-700 my-6"></div>

            {/* Features List */}
            <ul className="space-y-6">
              <li className="flex items-start">
                <FeatureIcon />
                <div>
                  <h3 className="font-semibold text-white">Visual Board Management</h3>
                  <p className="text-gray-400 mt-1">
                    Create, manage, and visualize your workflows with intuitive Kanban boards.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <FeatureIcon />
                <div>
                  <h3 className="font-semibold text-white">Team Collaboration</h3>
                  <p className="text-gray-400 mt-1">
                    Invite team members to your boards to collaborate on tasks in real-time.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <FeatureIcon />
                <div>
                  <h3 className="font-semibold text-white">Comprehensive Card Features</h3>
                  <p className="text-gray-400 mt-1">
                    Add rich descriptions, checklists, attachments, and due dates to your cards.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <FeatureIcon />
                <div>
                  <h3 className="font-semibold text-white">Archiving</h3>
                  <p className="text-gray-400 mt-1">
                    Keep your boards clean and focused by archiving completed cards and lists.
                  </p>
                </div>
              </li>
               <li className="flex items-start">
                <FeatureIcon />
                <div>
                  <h3 className="font-semibold text-white">Admin Panel</h3>
                  <p className="text-gray-400 mt-1">
                    Admins can globally manage all users, permissions, and boards from a central dashboard.
                  </p>
                </div>
              </li>
            </ul>
          </article>
          
        </div>
      </div>
    </div>
  );
};

export default WhatsNewPage;
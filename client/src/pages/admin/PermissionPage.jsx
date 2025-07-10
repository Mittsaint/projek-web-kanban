import React from 'react';

// Reusable Icon for checkmarks
const CheckIcon = () => (
    <svg className="h-6 w-6 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Component for displaying a single role's permissions
const RoleCard = ({ title, description, permissions }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 border border-gray-200 dark:border-gray-700">
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 pb-6">
            <ul className="space-y-3">
                {permissions.map((permission, index) => (
                    <li key={index} className="flex items-center text-sm"> {/* Changed 'items-start' to 'items-center' for vertical alignment */}
                        <CheckIcon />
                        <span className="ml-3 text-gray-700 dark:text-gray-300">{permission}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

// Main page component (no changes needed here)
const PermissionsPage = () => {
    const roles = [
        {
            title: "Administrator",
            description: "Has full access to the entire platform, including the most sensitive settings.",
            permissions: [
                "View application statistics dashboard.",
                "Manage (view, change roles, delete) all users.",
                "Manage (view and delete) all boards globally.",
                "Define and view role permissions (this page).",
            ],
        },
        {
            title: "Owner (Board Owner)",
            description: "Has full control over the boards they create, including managing members.",
            permissions: [
                "Create, modify, and delete their own boards.",
                "Invite and remove members from their boards.",
                "Create, modify, and delete lists & cards within their boards.",
                "Archive and restore their own boards.",
            ],
        },
        {
            title: "Member (Board Member)",
            description: "Standard role for collaborating within a board.",
            permissions: [
                "View and interact with boards they are invited to.",
                "Create, modify, and move cards within the board.",
                "Add comments and interact with other members.",
                "Cannot delete boards or remove other members.",
            ],
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h1>
                <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
                    Explanation of access rights for each role within the application.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                    <RoleCard key={role.title} {...role} />
                ))}
            </div>
        </div>
    );
};

export default PermissionsPage;
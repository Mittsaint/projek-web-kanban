import React, { useState, useEffect, useCallback, useMemo } from "react";
import adminService from "../../services/adminService";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Reusable Icon Component ---
const Icon = ({ name, className }) => {
  const icons = {
    users: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    boards: <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m3 6V7m-3 10h-3m-6 0H6a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-3m-6 0l-3-3m3 3l3-3m-3 3v-3m6 3l3-3M3 7l3 3m0 0l3-3m-3 3V4" />,
    lists: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
    cards: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
  };
  return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icons[name]}</svg>;
};

// --- StatCard Component ---
const StatCard = ({ title, value, iconName, onClick, isActive }) => (
  <div onClick={onClick} className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-4 cursor-pointer ${isActive ? 'ring-2 ring-blue-500' : 'ring-2 ring-transparent'}`}>
    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full"><Icon name={iconName} className="h-7 w-7 text-blue-600 dark:text-blue-400" /></div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// --- ConfirmationModal Component ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 flex items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10"><Icon name="trash" className="h-6 w-6 text-red-600 dark:text-red-400" /></div>
          <div className="ml-4 text-left">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{message}</p>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button type="button" onClick={onConfirm} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">Confirm Delete</button>
          <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// --- UserTable Component (Enhanced) ---
const UserTable = ({ users, onRoleChange, onDelete, selectedUsers, onSelectAll, onSelectOne }) => {
    const RoleBadge = ({ role }) => {
        const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-block capitalize";
        const roleClasses = { ADMIN: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300", MEMBER: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-300", OWNER: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" };
        return <span className={`${baseClasses} ${roleClasses[role] || "bg-gray-100 text-gray-800"}`}>{role}</span>;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-4 py-3 w-12">
                                <input type="checkbox" onChange={onSelectAll} checked={users.length > 0 && selectedUsers.length === users.length} indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr key={user._id} className={`transition-colors ${selectedUsers.includes(user._id) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                                <td className="px-4 py-4"><input type="checkbox" checked={selectedUsers.includes(user._id)} onChange={(e) => onSelectOne(e, user._id)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" /></td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><RoleBadge role={user.role} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => onRoleChange(user._id, user.role === 'ADMIN' ? 'MEMBER' : 'ADMIN')} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="Change Role"><Icon name="shield" className="h-5 w-5" /></button>
                                    <button onClick={() => onDelete(user)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete User"><Icon name="trash" className="h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Main AdminPage Component ---
const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [activeChart, setActiveChart] = useState('users');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for new features
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [statsData, usersData, growthData] = await Promise.all([adminService.getStats(), adminService.getAllUsers(), adminService.getUserGrowthData()]);
      setStats(statsData);
      setUsers(usersData);
      setUserGrowthData(growthData);
    } catch (err) {
      setError("Failed to load administrator data. Please ensure the backend is running and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- Filtering and Selection Logic ---
  const filteredUsers = useMemo(() =>
    users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [users, searchTerm]);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedUsers(filteredUsers.map(u => u._id));
    else setSelectedUsers([]);
  };

  const handleSelectOne = (e, userId) => {
    if (e.target.checked) setSelectedUsers(prev => [...prev, userId]);
    else setSelectedUsers(prev => prev.filter(id => id !== userId));
  };

  // --- Deletion Logic ---
  const handleDeleteClick = (user) => setUserToDelete({ type: 'single', data: user });
  const handleDeleteSelectedClick = () => setUserToDelete({ type: 'multiple', count: selectedUsers.length });

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      if (userToDelete.type === 'single') {
        await adminService.deleteUser(userToDelete.data._id);
      } else if (userToDelete.type === 'multiple') {
        // This service function needs to be created
        await adminService.deleteMultipleUsers(selectedUsers);
        setSelectedUsers([]);
      }
      fetchData(); // Refresh all data
    } catch (err) {
      setError("Failed to delete user(s).");
      console.error(err);
    } finally {
      setUserToDelete(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, { role: newRole });
      setUsers(prev => prev.map(user => user._id === userId ? { ...user, role: newRole } : user));
    } catch (err) {
      setError("Failed to update user role.");
      console.error(err);
    }
  };

  const contentData = [
      { name: 'Boards', count: stats?.boardCount ?? 0, fill: '#8884d8' },
      { name: 'Lists', count: stats?.listCount ?? 0, fill: '#82ca9d' },
      { name: 'Cards', count: stats?.cardCount ?? 0, fill: '#ffc658' },
  ];

  if (isLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading Admin Panel...</div>;
  if (error) return <div className="p-8 text-center text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-lg">{error}</div>;

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Platform overview, statistics, and user management.</p>
          </header>

          <main>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Users" value={stats?.userCount ?? "0"} iconName="users" onClick={() => setActiveChart('users')} isActive={activeChart === 'users'} />
                <StatCard title="Total Boards" value={stats?.boardCount ?? "0"} iconName="boards" onClick={() => setActiveChart('content')} isActive={activeChart === 'content'} />
                <StatCard title="Total Lists" value={stats?.listCount ?? "0"} iconName="lists" onClick={() => setActiveChart('content')} isActive={activeChart === 'content'} />
                <StatCard title="Total Cards" value={stats?.cardCount ?? "0"} iconName="cards" onClick={() => setActiveChart('content')} isActive={activeChart === 'content'} />
            </section>

            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-10">
              {activeChart === 'users' ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">User Growth (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={userGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                          <XAxis dataKey="day" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#e5e7eb' }} />
                          <Legend />
                          <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                      </LineChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Content Overview</h3>
                   <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={contentData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                          <XAxis type="number" stroke="#9ca3af" />
                          <YAxis type="category" dataKey="name" stroke="#9ca3af" width={80} />
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#e5e7eb' }} />
                          <Legend />
                          <Bar dataKey="count" name="Total Count" barSize={25} radius={[0, 10, 10, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </section>

            <section>
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{filteredUsers.length} of {users.length} users found.</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Icon name="search" className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
                    <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              {selectedUsers.length > 0 && (
                <div className="mb-4 flex justify-end">
                    <button onClick={handleDeleteSelectedClick} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-md">
                        <Icon name="trash" className="h-5 w-5" />
                        <span>Delete ({selectedUsers.length}) Selected Users</span>
                    </button>
                </div>
              )}
              <UserTable users={filteredUsers} onRoleChange={handleRoleChange} onDelete={handleDeleteClick} selectedUsers={selectedUsers} onSelectAll={handleSelectAll} onSelectOne={handleSelectOne} />
            </section>
          </main>
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
        title={userToDelete?.type === 'single' ? `Delete User: "${userToDelete.data.name}"?` : `Delete ${userToDelete?.count} Users?`}
        message="Are you sure you want to permanently delete the selected user(s)? This action cannot be undone."
      />
    </>
  );
};

export default AdminPage;

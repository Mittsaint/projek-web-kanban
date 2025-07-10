import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * This page is now deprecated. 
 * Navigation to specific settings (like Profile) is handled by the ProfilePopover.
 * We will rdirect users to the main profile page instead.
 */
const SettingsPage = () => {
  return <Navigate to="/profile" replace />;
};

export default SettingsPage;

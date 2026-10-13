import React from 'react';
import { AdminPage } from './AdminPage';

// Alias TeacherPage to AdminPage for seamless backward compatibility
export const TeacherPage: React.FC = () => {
  return <AdminPage />;
};

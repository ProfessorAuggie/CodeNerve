'use client';

import { useEffect } from 'react';
import { apiGetMe, getStoredToken } from '@/lib/api';
import { useUserStore } from '@/store/userStore';

export function SessionInitializer() {
  const { isStudentAuthenticated, setAuthenticatedStudentFromBackend, logoutStudent } = useUserStore();

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      return;
    }

    // Verify token with backend
    apiGetMe()
      .then((res) => {
        if (res.success && res.user) {
          setAuthenticatedStudentFromBackend(res.user);
        } else if (res.message && (res.message.includes('expired') || res.message.includes('denied') || res.message.includes('Invalid'))) {
          // Token is dead or user deleted
          logoutStudent();
        }
      })
      .catch(() => {
        // Network offline, keep offline store intact
      });
  }, [setAuthenticatedStudentFromBackend, logoutStudent]);

  return null;
}

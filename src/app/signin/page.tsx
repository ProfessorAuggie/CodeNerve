'use client';

import { Suspense } from 'react';
import { LoginPage } from '@/views/LoginPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading portal...</div>}>
      <LoginPage />
    </Suspense>
  );
}

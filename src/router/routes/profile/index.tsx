import { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import { ProfilePage, ProfilesPage } from './ProfileComponents';

export const profileRoutes: RouteObject[] = [
  {
    path: 'profiles',
    element: (
      <Suspense fallback={<div>Loading Profiles...</div>}>
        <ProtectedRoute allowedRoles={['admin', 'viewer']}>
          <ProfilesPage />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        path: ':profileId',
        element: (
          <Suspense fallback={<div>Loading Profile...</div>}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },
];

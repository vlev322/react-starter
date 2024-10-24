import { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

import { ProfilePage, ProfilesPage } from './ProfileComponents';

export const profileRoutes: RouteObject[] = [
  {
    path: 'profiles',
    element: (
      <Suspense fallback={<div>Loading Profiles...</div>}>
        <ProfilesPage />
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

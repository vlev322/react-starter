import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const ProfilesPage = lazy(() => import('../pages/ProfilesPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

export const profileRoutes: RouteObject[] = [
  {
    path: 'profiles',
    element: <ProfilesPage />,
    children: [
      {
        path: ':profileId',
        element: <ProfilePage />,
      },
    ],
  },
];


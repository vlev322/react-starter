import { RouteObject } from 'react-router-dom';

import { ProfilePage,ProfilesPage } from './ProfileComponents';

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

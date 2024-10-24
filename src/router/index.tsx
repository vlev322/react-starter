import { createBrowserRouter } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/ProfilePage';
import ProfilesPage from '../pages/ProfilesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/profiles',
    element: <ProfilesPage />,
    children: [
      {
        path: '/profiles/:profileId',
        element: <ProfilePage />,
      },
    ],
  },
]);

export default router;


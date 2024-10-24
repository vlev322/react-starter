import { createBrowserRouter } from 'react-router-dom';

import Layout from '../components/Layout';
import { mainRoutes } from './routes';
import { NotFoundPage } from "./routes/main/NotFoundComponents";
import { profileRoutes } from './routes/profile/profileRoutes';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      ...mainRoutes,
      ...profileRoutes,
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;

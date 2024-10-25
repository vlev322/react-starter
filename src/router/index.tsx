import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import LoginPage from "@/pages/LoginPage";

import Layout from '../components/Layout';
import { mainRoutes, profileRoutes,starWarsRoutes  } from './routes';
import { NotFoundPage } from "./routes/main/NotFoundComponents";

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: (
      <Suspense fallback={<div>Loading Layout...</div>}>
        <Layout />
      </Suspense>
    ),
    children: [
      ...mainRoutes,
      ...profileRoutes,
      ...starWarsRoutes,
      {
        path: '*',
        element: (
          <Suspense fallback={<div>Loading Not Found Page...</div>}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;

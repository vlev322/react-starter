import { RouteObject } from 'react-router-dom';

import { HomePage } from './HomeComponents';
import { NotFoundPage } from './NotFoundComponents';

export const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },

];

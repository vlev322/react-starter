import { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

import { HomePage } from './HomeComponents';
import { NotFoundPage } from './NotFoundComponents';

export const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Loading Home...</div>}>
        <HomePage />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<div>Loading Error Page...</div>}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];

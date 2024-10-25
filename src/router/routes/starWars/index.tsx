import { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

import { StarWarsPage } from "./StarWarsComponents";

export const starWarsRoutes: RouteObject[] = [
  {
    path: '/star-wars',
    element: (
      <Suspense fallback={<div>Loading Star Wars Data...</div>}>
        <StarWarsPage />
      </Suspense>
    ),
  },
];

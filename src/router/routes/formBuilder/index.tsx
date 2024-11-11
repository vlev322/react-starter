import { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

import { FormBuilderPage } from "./FormBuilderComponents";

export const formBuilderRoutes: RouteObject[] = [
  {
    path: '/form-builder',
    element: (
      <Suspense fallback={<div>Loading Form Builder Data...</div>}>
        <FormBuilderPage />
      </Suspense>
    ),
  },
];

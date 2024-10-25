import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { RouterProvider } from 'react-router-dom';

import AuthProvider from "./components/auth/AuthProvider";
import router from './router';
import { store } from "./state/store";

import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
);

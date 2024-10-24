import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  if (currentUser === undefined) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children ?? <Outlet />;
}


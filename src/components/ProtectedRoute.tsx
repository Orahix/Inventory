import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Admin' | 'Manager' | 'Staff';
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  fallback 
}) => {
  const { userProfile, hasAccess, isAdmin, isManager } = useAuth();

  if (!hasAccess()) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Nemate dozvolu</h2>
          <p className="text-gray-600">Nemate dozvolu za pristup ovoj stranici.</p>
        </div>
      </div>
    );
  }

  // Check specific role requirements
  if (requiredRole) {
    const hasRequiredRole = 
      (requiredRole === 'Admin' && isAdmin()) ||
      (requiredRole === 'Manager' && (isManager() || isAdmin())) ||
      (requiredRole === 'Staff' && (userProfile?.role === 'Staff' || isManager() || isAdmin()));

    if (!hasRequiredRole) {
      return fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Nedovoljna dozvola</h2>
            <p className="text-gray-600">
              Potrebna je {requiredRole} dozvola za pristup ovoj stranici.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
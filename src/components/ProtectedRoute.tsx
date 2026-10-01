import { Navigate, Outlet } from 'react-router-dom';

const isUserAdmin = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const payload = JSON.parse(decodedJson);

    const userRole = 
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
      payload.role || 
      payload.Role;

    return userRole === 'Admin';
  } catch (error) {
    console.error('Greška pri dekodiranju tokena:', error);
    return false;
  }
};

export const ProtectedRoute = () => {
  const isAdmin = isUserAdmin();

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
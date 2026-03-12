import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './store/AuthContext';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function LoginPage() {
  return <div>Login page (coming soon)</div>;
}

function RegisterPage() {
  return <div>Register page (coming soon)</div>;
}

function TripsPage() {
  return <div>Trips page (coming soon)</div>;
}

function TripDetailPage() {
  return <div>Trip detail page (coming soon)</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/trips" replace />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/:id" element={<TripDetailPage />} />
      </Route>
    </Routes>
  );
}

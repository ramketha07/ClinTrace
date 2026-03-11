import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDetails from './pages/PatientDetails';
import NewDecision from './pages/NewDecision';
import DecisionPage from './pages/DecisionPage';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const RoleRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />; // Fallback
  }
  return <Outlet />;
};

const DashboardDispatcher = () => {
  const { user } = useAuth();
  if (user?.role === 'RECEPTIONIST') return <ReceptionistDashboard />;
  if (user?.role === 'DOCTOR') return <DoctorDashboard />;
  if (user?.role === 'ADMIN') return <AdminDashboard />;
  return <div>Unauthorized</div>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardDispatcher />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<RoleRoute allowedRoles={['DOCTOR', 'ADMIN']} />}>
              <Route path="/patients/:id/new-decision" element={<NewDecision />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={['RECEPTIONIST', 'DOCTOR', 'ADMIN']} />}>
              <Route path="/patients/:id" element={<PatientDetails />} />
              <Route path="/decisions/:id" element={<DecisionPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

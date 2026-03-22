// Verified App.jsx updates.
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Tickets from './pages/Tickets';
import Team from './pages/Team';
import KnowledgeBase from './pages/KnowledgeBase';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';

// Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-900 dark:text-white bg-white dark:bg-slate-950">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Wrapper to switch dashboard based on role
const DashboardSwitch = () => {
  const { user } = useAuth();
  if (user?.role === 'MANAGER') return <ManagerDashboard />;
  if (user?.role === 'CUSTOMER') return <CustomerDashboard />;
  if (user?.role === 'EMPLOYEE') return <EmployeeDashboard />;
  return <Dashboard />; // Default Fallback
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }>
              <Route path="/dashboard" element={<DashboardSwitch />} />
              <Route path="/tickets" element={<Tickets />} /> {/* For Customers */}

              {/* Added Sidebar Mappings */}
              <Route path="/all-tickets" element={<Tickets />} /> {/* For Managers */}
              <Route path="/assigned-tickets" element={<Tickets />} /> {/* For Employees */}
              <Route path="/team" element={<Team />} /> {/* For Managers */}
              <Route path="/analytics" element={<Dashboard />} />
              <Route path="/knowledge-base" element={<KnowledgeBase />} />

              <Route path="/settings" element={<div>Settings Page</div>} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

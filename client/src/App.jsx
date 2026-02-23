import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './hooks/ProtectedRoute';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddLead from './pages/AddLead';
import LeadsTable from './pages/LeadsTable';
import Analytics from './pages/Analytics';

const PendingPage = () => <LeadsTable status="pending" title="Pending Leads" />;
const WaitingPage = () => <LeadsTable status="waiting" title="Waiting Leads" />;
const ApprovedPage = () => <LeadsTable status="approved" title="Approved Leads" />;
const RejectedPage = () => <LeadsTable status="rejected" title="Rejected Leads" />;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="add-lead" element={<AddLead />} />
              <Route path="pending" element={<PendingPage />} />
              <Route path="waiting" element={<WaitingPage />} />
              <Route path="approved" element={<ApprovedPage />} />
              <Route path="rejected" element={<RejectedPage />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

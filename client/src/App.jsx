import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import SubmitComplaint from './pages/SubmitComplaint';
import AdminDashboard from './pages/AdminDashboard';
import Insights from './pages/Insights';
import MyComplaints from './pages/MyComplaints';
import PublicDashboard from './pages/PublicDashboard';
import PendingOfficials from './pages/PendingOfficials';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/submit" element={<SubmitComplaint />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/my-complaints" element={<MyComplaints />} />
          <Route path="/transparency" element={<PublicDashboard />} />
          <Route path="/pending-officials" element={<PendingOfficials />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
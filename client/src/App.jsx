import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './pages/Login';
import SubmitComplaint from './pages/SubmitComplaint';
import AdminDashboard from './pages/AdminDashboard';
import Insights from './pages/Insights';
import Register from './pages/Register';
import MyComplaints from './pages/MyComplaints';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/submit" element={<SubmitComplaint />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-complaints" element={<MyComplaints />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
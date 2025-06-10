import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import { UserDataProvider } from './contexts/UserDataContext';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import RequestsList from './pages/admin/RequestsList';
import AdminEquipmentList from './pages/admin/EquipmentList';
import AdminStatistics from './pages/admin/Statistics';
import AdminAlerts from './pages/admin/Alerts';
import AdminInfo from './pages/admin/AdminInfo';
import AdminChangePassword from './pages/admin/AdminChangePassword';

function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="requests" element={<RequestsList />} />
                <Route path="equipment" element={<AdminEquipmentList />} />
                <Route path="statistics" element={<AdminStatistics />} />
                <Route path="alerts" element={<AdminAlerts />} />
                <Route path="info" element={<AdminInfo />} />
                <Route path="change-password" element={<AdminChangePassword />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import TopHeader from './components/Header/TopHeader';
import MainHeader from './components/Header/MainHeader';
import AdminLayout from './layouts/AdminLayout';
import { UserDataProvider } from './contexts/UserDataContext';

// User Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Equipment from './pages/Equipment';
import MyRequests from './pages/MyRequests';
import Notifications from './pages/Notifications';

// Admin Pages
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

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<PrivateRoute />}>
              <Route path="/home" element={
                <>
                  <TopHeader />
                  <MainHeader />
                  <main className="container mx-auto px-4 py-8">
                    <Home />
                  </main>
                </>
              } />
              <Route path="/notifications" element={
                <>
                  <TopHeader />
                  <MainHeader />
                  <main className="container mx-auto px-4 py-8">
                    <Notifications />
                  </main>
                </>
              } />
              <Route path="/equipment" element={
                <>
                  <TopHeader />
                  <MainHeader />
                  <main className="container mx-auto px-4 py-8">
                    <Equipment />
                  </main>
                </>
              } />
              <Route path="/my-requests" element={
                <>
                  <TopHeader />
                  <MainHeader />
                  <main className="container mx-auto px-4 py-8">
                    <MyRequests />
                  </main>
                </>
              } />
            </Route>

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

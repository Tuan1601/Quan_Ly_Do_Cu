import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Requests from '../pages/admin/Requests';
import EquipmentList from '../pages/admin/EquipmentList';
import Statistics from '../pages/admin/Statistics';
import Alerts from '../pages/admin/Alerts';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="requests" element={<Requests />} />
        <Route path="equipment" element={<EquipmentList />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="alerts" element={<Alerts />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes; 
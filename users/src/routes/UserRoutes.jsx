import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Equipment from '../pages/Equipment';
import Borrow from '../pages/Borrow';
import History from '../pages/History';
import Notifications from '../pages/Notifications';

const UserRoutes = () => {
  return (
    <UserLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/borrow" element={<Borrow />} />
        <Route path="/history" element={<History />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </UserLayout>
  );
};

export default UserRoutes; 
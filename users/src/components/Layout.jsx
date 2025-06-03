import React from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './Header/TopHeader';
import MainHeader from './Header/MainHeader';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <TopHeader />
        <MainHeader />
      </div>

      <main className="flex-grow bg-gray-50 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-[2000px] mx-auto">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout; 
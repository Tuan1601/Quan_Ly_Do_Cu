import React from 'react';
import TopHeader from '../components/Header/TopHeader';
import MainHeader from '../components/Header/MainHeader';
import Footer from '../components/Footer';

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopHeader />
      <MainHeader />
      <main className="flex-1 container mx-auto py-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout; 
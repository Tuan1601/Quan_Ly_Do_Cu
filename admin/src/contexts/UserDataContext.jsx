import React, { createContext, useContext, useState } from 'react';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const updateUserData = (newData) => {
    setUserData(newData);
    setLastUpdate(Date.now());
  };

  return (
    <UserDataContext.Provider value={{ userData, updateUserData, lastUpdate }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}; 
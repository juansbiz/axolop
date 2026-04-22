import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const RolesContext = createContext();

export function RolesProvider({ children }) {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const value = {
    roles,
    loading,
    isAdmin: true,
    isOwner: true,
    can: () => true,
  };

  return (
    <RolesContext.Provider value={value}>
      {children}
    </RolesContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RolesContext);
  if (!context) {
    return {
      roles: [],
      loading: false,
      isAdmin: true,
      isOwner: true,
      can: () => true,
    };
  }
  return context;
}

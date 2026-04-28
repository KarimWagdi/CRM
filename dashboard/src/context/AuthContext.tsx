import React, { createContext, useContext, useState, type ReactNode } from 'react';

type Role = 'Admin' | 'Sales' | 'HR' | 'Project' | 'Finance';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: {
    name: string;
    email: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('Admin');
  const [user] = useState({
    name: 'Jules Engineer',
    email: 'jules@example.com',
  });

  return (
    <AuthContext.Provider value={{ role, setRole, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

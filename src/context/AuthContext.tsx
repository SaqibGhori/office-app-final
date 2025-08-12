import React, { createContext, useContext, useState} from 'react';

 interface AuthContextType {
   token: string | null;
   role: 'user' | 'admin' | 'superadmin' | null;
   user: { email: string } | null;
   login: (token: string, role: string, email: string) => void;
   logout: () => void;
 }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [role, setRole]   = useState<AuthContextType['role']>(() => localStorage.getItem('role') as any);
  const [user, setUser]   = useState<AuthContextType['user']>(() => {
    const email = localStorage.getItem('email');
    return email ? { email } : null;
  });

  const login = (newToken: string, newRole: string, email: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('email', email);
    setToken(newToken);
    setRole(newRole as AuthContextType['role']);
    setUser({ email });
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUser(null);
  };

  // Optionally: on mount, you could verify token validity here

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

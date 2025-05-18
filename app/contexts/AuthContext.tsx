import React, { createContext, useContext, useState } from 'react';

interface AuthContextData {
  isAuthenticated: boolean;
  email: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  // Mock authentication functions
  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    // For now, we'll just simulate success if fields aren't empty
    if (email && password) {
      setIsAuthenticated(true);
      setEmail(email);
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string) => {
    // In a real app, this would create an account
    // For now, just simulate success
    if (email && password) {
      setIsAuthenticated(true);
      setEmail(email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
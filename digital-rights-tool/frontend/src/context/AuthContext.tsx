import React, { createContext, useState, useContext, ReactNode } from 'react';

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
}

// Auth context type definition
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mock user data
  const mockUser: User = {
    id: 'mock-user-id',
    name: 'Mock User',
    email: 'mock@example.com'
  };

  const [user, setUser] = useState<User | null>(mockUser);
  const [token, setToken] = useState<string | null>('mock-token');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  // Register a new user
  const register = async (_name: string, _email: string, _password: string) => {
    // Mock successful registration
    setUser(mockUser);
    setToken('mock-token');
    setIsAuthenticated(true);
  };

  // Login user
  const login = async (_email: string, _password: string) => {
    // Mock successful login
    setUser(mockUser);
    setToken('mock-token');
    setIsAuthenticated(true);
  };

  // Logout user
  const logout = () => {
    // Mock logout - still keep user authenticated
    setUser(mockUser);
    setToken('mock-token');
    setIsAuthenticated(true);
  };

  // Provide auth context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext); 
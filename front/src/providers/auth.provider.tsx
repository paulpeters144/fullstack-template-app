import { createContext, useContext, useState } from 'react';

export interface IAuthContext {
  login: () => void;
  logout: () => void;
  isActive: boolean;
}

const AuthContext = createContext<IAuthContext>({
  login: () => {},
  logout: () => {},
  isActive: false,
});

export const AuthProvider = ({ children }) => {
  const [isActive, setActive] = useState(false);

  const login = () => {
    setActive(true);
  };
  const logout = () => setActive(false);

  return (
    <AuthContext.Provider value={{ isActive, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

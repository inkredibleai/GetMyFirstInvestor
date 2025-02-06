import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminEmail: string | null;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  adminEmail: null,
  logout: () => {},
});

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated') === 'true';
    const email = localStorage.getItem('adminEmail');
    setIsAuthenticated(authStatus);
    setAdminEmail(email);
  }, []);

  const logout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminEmail');
    setIsAuthenticated(false);
    setAdminEmail(null);
    navigate('/admin/login');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, adminEmail, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

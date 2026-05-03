import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_BASE = 'http://localhost:8081/api';

// Fonction pour décoder le token JWT
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Vérifier si le token est expiré
const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  const expirationTime = decoded.exp * 1000;
  return Date.now() >= expirationTime;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier l'authentification
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token && !isTokenExpired(token) && user !== null;
  };

  // Vérifier l'état du token au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && isTokenExpired(token)) {
      logout();
    } else if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Vérifier périodiquement l'expiration du token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    const checkExpiration = () => {
      if (isTokenExpired(token)) {
        logout();
        alert('Votre session a expiré. Veuillez vous reconnecter.');
        window.location.href = '/signin';
      }
    };

    const interval = setInterval(checkExpiration, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email, password }).toString(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ email, role: data.role }));
    setUser({ email, role: data.role });
    return { email, role: data.role };
  };

  const register = async (firstName, lastName, email, password) => {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ firstName, lastName, email, password }).toString(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      isAdmin,
      isAuthenticated,
      isTokenExpired
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
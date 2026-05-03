// src/hooks/useUsers.js
import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8081/api';
const API_USERS = `${API_BASE}/users`;

// Fonction de vérification du token
const checkTokenAndRedirect = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    const expirationTime = decoded.exp * 1000;
    
    if (Date.now() >= expirationTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem('token');

  const fetchUsers = async () => {
    if (!checkTokenAndRedirect()) {
      setLoading(false);
      return;
    }
    
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(API_USERS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Non autorisé - Veuillez vous reconnecter");
        }
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const deleteUser = async (userId) => {
    if (!checkTokenAndRedirect()) throw new Error("Session expirée");
    
    const token = getToken();
    if (!token) throw new Error("Non authentifié");

    const res = await fetch(`${API_USERS}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression");
    await fetchUsers();
    return data;
  };

  return { users, loading, error, fetchUsers, deleteUser };
}
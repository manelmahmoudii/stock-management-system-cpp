import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8081/api';
const API_USERS = `${API_BASE}/users`;

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem('token');

  const fetchUsers = async () => {
    const token = getToken();
    
    // Si pas de token, ne pas faire la requête
    if (!token) {
      console.log("No token found, skipping fetchUsers");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching users with token:", token.substring(0, 20) + "...");
      
      const res = await fetch(API_USERS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Response status:", res.status);
      
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
    // Attendre un peu pour que le token soit disponible
    const timer = setTimeout(() => {
      fetchUsers();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const deleteUser = async (userId) => {
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
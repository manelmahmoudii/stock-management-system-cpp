// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8081/api';

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
    console.error('Token check error:', error);
    return false;
  }
};

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    if (!checkTokenAndRedirect()) return;
    
    try {
      setLoading(true);
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Impossible de charger les produits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const createProduct = async (productData) => {
    if (!checkTokenAndRedirect()) throw new Error('Session expirée');
    
    const body = new URLSearchParams(productData).toString();
    const res = await fetch(`${API}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    await fetchProducts();
    return data;
  };

  const updateProduct = async (productId, productData) => {
    if (!checkTokenAndRedirect()) throw new Error('Session expirée');
    
    const body = new URLSearchParams(productData).toString();
    const res = await fetch(`${API}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    await fetchProducts();
    return data;
  };

  const deleteProduct = async (productId) => {
    if (!checkTokenAndRedirect()) throw new Error('Session expirée');
    
    const res = await fetch(`${API}/products/${productId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    await fetchProducts();
    return data;
  };

  const sellProduct = async (productId, quantity) => {
    if (!checkTokenAndRedirect()) throw new Error('Session expirée');
    
    const token = localStorage.getItem('token');
    const body = new URLSearchParams({ quantity }).toString();
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API}/products/${productId}/sell`, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, quantity: data.product.quantity } : p
      )
    );
    
    return data;
  };

  const deliverProduct = async (productId, quantity) => {
    if (!checkTokenAndRedirect()) throw new Error('Session expirée');
    
    const token = localStorage.getItem('token');
    const body = new URLSearchParams({ quantity }).toString();
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API}/products/${productId}/deliver`, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    await fetchProducts();
    return data;
  };

  return { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    refreshProducts: fetchProducts,
    sellProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deliverProduct 
  };
}
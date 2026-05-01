// src/hooks/useProducts.js
import { useState, useEffect } from 'react';

const API = 'http://localhost:8081/api';

export function useProducts() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // Charge tous les produits depuis le backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/products`);
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

  // Création d'un produit
  const createProduct = async (productData) => {
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

  // Mise à jour d'un produit
  const updateProduct = async (productId, productData) => {
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

  // Suppression d'un produit
  const deleteProduct = async (productId) => {
    const res = await fetch(`${API}/products/${productId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    await fetchProducts();
    return data;
  };

  // Vente d'un produit
  const sellProduct = async (productId, quantity) => {
    const body = new URLSearchParams({ quantity }).toString();
    const res  = await fetch(`${API}/products/${productId}/sell`, {
      method: 'POST',
      body,
    });
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, quantity: data.product.quantity }
          : p
      )
    );

    return data;
  };
// Ajoutez cette fonction dans votre hook
const deliverProduct = async (productId, quantity) => {
  const body = new URLSearchParams({ quantity }).toString();
  const res = await fetch(`${API}/products/${productId}/deliver`, {
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
import { useState, useEffect } from 'react';
import { useProducts } from './useProducts';

export function useStockAlerts() {
  const { products, loading } = useProducts();
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [outOfStockAlerts, setOutOfStockAlerts] = useState([]);
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(false);

  useEffect(() => {
    if (!loading && products.length > 0) {
      // Produits en stock faible (0 < quantité <= seuil min)
      const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.minThreshold);
      // Produits en rupture (quantity = 0)
      const outOfStock = products.filter(p => p.quantity === 0);
      
      setLowStockAlerts(lowStock);
      setOutOfStockAlerts(outOfStock);
      setHasUnreadAlerts(lowStock.length > 0 || outOfStock.length > 0);
    }
  }, [products, loading]);

  const markAsRead = () => {
    setHasUnreadAlerts(false);
  };

  const getAlertMessage = (product) => {
    if (product.quantity === 0) {
      return `⚠️ ${product.name} est en rupture de stock !`;
    }
    if (product.quantity <= product.minThreshold) {
      return `📦 ${product.name} a un stock faible (${product.quantity}/${product.minThreshold})`;
    }
    return '';
  };

  return {
    lowStockAlerts,
    outOfStockAlerts,
    hasUnreadAlerts,
    markAsRead,
    getAlertMessage,
    totalAlerts: lowStockAlerts.length + outOfStockAlerts.length
  };
}
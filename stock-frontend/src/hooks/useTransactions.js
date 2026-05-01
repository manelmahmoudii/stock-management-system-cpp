import { useState, useEffect } from 'react';

const API = 'http://localhost:8081/api';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/transactions`);
      const data = await res.json();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionsByProduct = async (productId) => {
    try {
      const res = await fetch(`${API}/transactions/product/${productId}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return { transactions, loading, error, fetchTransactions, fetchTransactionsByProduct };
}
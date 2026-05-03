// src/componentsClient/CartDrawer.jsx - Ajoutez triggerCartUpdate
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = 'http://localhost:8081/api';

// Fonction pour déclencher la mise à jour du compteur
const triggerCartUpdate = () => {
  window.dispatchEvent(new Event('cartUpdated'));
};

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  updateQuantity, 
  removeItem 
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState('');
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const getToken = () => localStorage.getItem('token');

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      if (!decoded.exp) return true;
      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      return true;
    }
  };

  const redirectToLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  // Wrappers pour déclencher la mise à jour
  const handleUpdateQuantity = (id, newQuantity) => {
    updateQuantity(id, newQuantity);
    triggerCartUpdate();
  };

  const handleRemoveItem = (id) => {
    removeItem(id);
    triggerCartUpdate();
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    const token = getToken();
    
    if (!token) {
      setCheckoutMsg('⚠️ Please login to checkout');
      setTimeout(() => redirectToLogin(), 2000);
      return;
    }
    
    if (isTokenExpired(token)) {
      setCheckoutMsg('⚠️ Session expired, please login again');
      setTimeout(() => redirectToLogin(), 2000);
      return;
    }
    
    setIsCheckingOut(true);
    setCheckoutMsg('');
    const errors = [];

    for (const item of cartItems) {
      try {
        const body = new URLSearchParams({ quantity: item.quantity }).toString();
        const res = await fetch(`${API}/products/${item.id}/sell`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`,
          },
          body: body,
        });
        
        if (res.status === 401) {
          setCheckoutMsg('⚠️ Session expired');
          setTimeout(() => redirectToLogin(), 2000);
          return;
        }
        
        const data = await res.json();
        if (data.error) {
          errors.push(`${item.name} : ${data.error}`);
        } else {
          console.log('✅ Transaction recorded:', data.transaction);
        }
      } catch (error) {
        errors.push(`${item.name} : network error`);
      }
    }

    setIsCheckingOut(false);

    if (errors.length > 0) {
      setCheckoutMsg('⚠️ ' + errors.join(' | '));
    } else {
      setCheckoutMsg('✅ Order confirmed! Thank you for your purchase.');
      setTimeout(() => {
        cartItems.forEach(item => removeItem(item.id));
        triggerCartUpdate();
        setCheckoutMsg('');
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 z-50">
      <div className="pointer-events-auto w-screen max-w-md">
        <div className="flex h-full flex-col px-4 py-6 sm:px-6 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-6 border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">
              Your Cart ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              ✕
            </button>
          </div>

          {/* Message checkout */}
          {checkoutMsg && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              checkoutMsg.startsWith('✅') ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
            }`}>
              {checkoutMsg}
            </div>
          )}

          {/* Liste des articles */}
          <div className="flex-1 overflow-y-auto pt-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between py-5 border-b border-gray-100">
                <div className="flex gap-4">
                  <img className="w-20 h-20 object-cover rounded" src={item.image} alt={item.name} />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500">${item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 border rounded">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 border rounded">+</button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 text-sm mt-2">Remove</button>
                </div>
              </div>
            ))}
            {cartItems.length === 0 && (
              <p className="text-center text-gray-500 py-8">Your cart is empty.</p>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 py-6">
              <div className="flex justify-between mb-4">
                <span>Total</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-violet-500 text-white py-3 rounded-lg hover:bg-violet-600 disabled:bg-violet-300"
              >
                {isCheckingOut ? 'Processing...' : 'Order'}
              </button>
              <button onClick={onClose} className="w-full text-center text-gray-500 mt-3">
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
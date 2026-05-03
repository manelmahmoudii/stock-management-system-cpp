// src/pages/Client/ClientPage.jsx
import { useState, useEffect } from 'react';
import Header from '../../componentsClient/Header';
import Hero from '../../componentsClient/hero';
import CategorySlider from '../../componentsClient/CategorySlider';
import TrendingProducts from '../../componentsClient/TrendingProducts';
import CTABanner from '../../componentsClient/CTABanner';
import Features from '../../componentsClient/Features';
import Footer from '../../componentsClient/Footer';
import CartDrawer from '../../componentsClient/CartDrawer';

const triggerCartUpdate = () => {
  window.dispatchEvent(new Event('cartUpdated'));
};

export default function ClientPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        triggerCartUpdate();
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, []);

  const saveCartToLocalStorage = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    triggerCartUpdate();
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      saveCartToLocalStorage(newCart);
      setIsCartOpen(true);
      return newCart;
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(prev => {
      const newCart = prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      saveCartToLocalStorage(newCart);
      return newCart;
    });
  };

  const removeItem = (id) => {
    setCartItems(prev => {
      const newCart = prev.filter(item => item.id !== id);
      saveCartToLocalStorage(newCart);
      return newCart;
    });
  };

  return (
    <div className="antialiased bg-white dark:bg-gray-900">
      <Header onCartClick={() => setIsCartOpen(true)} />  {/* ← Passe la prop ici */}
      <main>
        <Hero />
        <CategorySlider />
        <TrendingProducts onAddToCart={addToCart} />
        <CTABanner />
        <Features />
      </main>
      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    </div>
  );
}
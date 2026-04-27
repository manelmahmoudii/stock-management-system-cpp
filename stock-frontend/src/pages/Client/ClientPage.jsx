// src/pages/ClientPage.jsx
import { useState } from 'react';
import Header from '../../componentsClient/Header';
import Hero from '../../componentsClient/hero';
import CategorySlider from '../../componentsClient/CategorySlider';
import TrendingProducts from '../../componentsClient/TrendingProducts';
import CTABanner from '../../componentsClient/CTABanner';
import Features from '../../componentsClient/Features';
import Footer from '../../componentsClient/Footer';
import CartDrawer from '../../componentsClient/CartDrawer';   // ✅ import du drawer

export default function ClientPage() {
  // État du panier (identique à ShopPage)
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Ajouter un produit au panier
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // Modifier la quantité
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Supprimer un article
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="antialiased bg-white">
      <Header />
      <main>
        <Hero />
        <CategorySlider />
        {/* ✅ on passe la fonction addToCart à TrendingProducts */}
        <TrendingProducts onAddToCart={addToCart} />
        <CTABanner />
        <Features />
      </main>
      <Footer />

      {/* Panier latéral */}
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
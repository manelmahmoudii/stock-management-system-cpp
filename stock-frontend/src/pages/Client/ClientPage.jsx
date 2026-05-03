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
import { useAuth } from '../../context/AuthContext';

export default function ClientPage() {
  // État du panier
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  // Charger le panier depuis localStorage au chargement
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Ajouter un produit au panier
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
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
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Supprimer un article
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Calculer le nombre total d'articles
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="antialiased bg-white">
      <Header cartCount={getCartCount()} />
      <main>
        <Hero />
        <CategorySlider />
        
        {/* Section "Just Launched" - Style That Moves With You */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Just Launched
            </h2>
            <p className="text-lg text-gray-600">
              Style That Moves With You
            </p>
          </div>
          
          {/* Smartphone Banner - CORRIGÉ */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl overflow-hidden mb-16">
            <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
              <div className="text-white mb-6 md:mb-0">
                <div className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-medium mb-4">
                  New Arrival
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-3">
                  Smartphone
                </h3>
                <p className="text-white/90 text-lg max-w-md">
                  Power and Performance Designed for Everyday Use
                </p>
                <button className="mt-6 bg-white text-violet-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Shop Now →
                </button>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <img 
                  src="/client/imagesClient/smartphone-banner.png" 
                  alt="Smartphone" 
                  className="w-full max-w-[250px] h-auto drop-shadow-2xl"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x400/1e1b4b/ffffff?text=Smartphone";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

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
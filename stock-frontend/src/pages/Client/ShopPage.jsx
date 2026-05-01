// src/pages/Client/ShopPage.jsx
import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../componentsClient/ProductCard';
import Header from '../../componentsClient/Header';
import Footer from '../../componentsClient/Footer';
import CartDrawer from '../../componentsClient/CartDrawer';

// Images fallback
import productImg1 from '../../../public/client/imagesClient/products/image-1.png';
import productImg2 from '../../../public/client/imagesClient/products/image-2.png';
import productImg3 from '../../../public/client/imagesClient/products/image-3.png';
import productImg4 from '../../../public/client/imagesClient/products/image-4.png';
import productImg5 from '../../../public/client/imagesClient/products/image-5.png';
import productImg6 from '../../../public/client/imagesClient/products/image-6.png';
import productImg7 from '../../../public/client/imagesClient/products/image-7.png';
import productImg8 from '../../../public/client/imagesClient/products/image-8.png';

const fallbackImages = [
  productImg1, productImg2, productImg3, productImg4,
  productImg5, productImg6, productImg7, productImg8,
];

export default function ShopPage() {
  // ─── Données depuis le backend ──────────────────────────────────────
  const { products, loading, error } = useProducts();

  // ─── Filtres (identiques à avant) ──────────────────────────────────
  const [filtersVisible, setFiltersVisible]         = useState(false);
  const [priceMin, setPriceMin]                     = useState(0);
  const [priceMax, setPriceMax]                     = useState(2000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedBrands, setSelectedBrands]         = useState([]);
  const [selectedColors, setSelectedColors]         = useState([]);
  const [selectedSizes, setSelectedSizes]           = useState([]);
  const [sortBy, setSortBy]                         = useState('Best selling');
  const [currentPage, setCurrentPage]               = useState(1);
  const productsPerPage = 6;

  // ─── Panier ─────────────────────────────────────────────────────────
  const [cartItems, setCartItems]   = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) { removeItem(id); return; }
    setCartItems(prev =>
      prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleFilter = (value, list, setList) => {
    setList(list.includes(value)
      ? list.filter(v => v !== value)
      : [...list, value]
    );
  };

  const resetFilters = () => {
    setPriceMin(0); setPriceMax(2000);
    setSelectedCategories([]); setSelectedAvailability([]);
    setSelectedBrands([]); setSelectedColors([]); setSelectedSizes([]);
  };

  // ─── Enrichit les produits avec images fallback ──────────────────────
  const enrichedProducts = products.map((p, i) => ({
    ...p,
    image: fallbackImages[i % fallbackImages.length],
    // badge selon le stock
    badge: p.quantity === 0 ? 'Out of stock'
         : p.quantity <= p.minThreshold ? 'Low stock'
         : null,
    badgeColor: p.quantity === 0 ? 'violet'
              : p.quantity <= p.minThreshold ? 'violet'
              : 'green',
  }));

  // ─── Filtrage ────────────────────────────────────────────────────────
  let filtered = enrichedProducts.filter(p => {
    if (p.price < priceMin || p.price > priceMax) return false;
    if (selectedAvailability.includes('In stock')    && p.quantity === 0)  return false;
    if (selectedAvailability.includes('Out of stock') && p.quantity > 0)   return false;
    if (selectedCategories.length > 0 &&
        !selectedCategories.includes(p.category)) return false;
    return true;
  });

  // ─── Tri ─────────────────────────────────────────────────────────────
  if (sortBy === 'Price, Low to high')  filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'Price, high to low')  filtered.sort((a, b) => b.price - a.price);
  if (sortBy === 'Alphabetically, A-Z') filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'Alphabetically, Z-A') filtered.sort((a, b) => b.name.localeCompare(a.name));

  // ─── Pagination ──────────────────────────────────────────────────────
  const totalPages   = Math.ceil(filtered.length / productsPerPage);
  const paginated    = filtered.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // ─── Render ──────────────────────────────────────────────────────────
  return (
    <>
      <Header />
      <main>
        {/* Breadcrumb — identique */}
        <section className="lg:pt-20 pt-14 pb-10 lg:pb-16">
          <div className="max-w-7xl mx-auto px-4 xl:px-6">
            <div className="mx-auto max-w-lg mb-4 text-center">
              <h1 className="text-4xl lg:text-5xl font-medium text-gray-900 mb-4">Shop all</h1>
              <p className="text-base text-gray-500">
                Our most-loved gadgets, trusted by thousands of customers.
              </p>
            </div>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm">
                <li className="inline-flex items-center">
                  <a className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900" href="/client">
                    Home
                  </a>
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5.83333 12.6667L10 8.50008L5.83333 4.33341" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </li>
                <li>
                  <a className="inline-flex items-center gap-1 font-medium text-gray-900" href="/shop">Shop</a>
                </li>
              </ol>
            </nav>
          </div>
        </section>

        <section className="bg-white pb-10 lg:pb-20">
          <div className="max-w-7xl mx-auto px-4 xl:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

              {/* ── Sidebar filtres (identique à ton code) ────────────────── */}
              <aside className={`fixed top-0 left-0 h-full w-80 lg:rounded-xl lg:static lg:w-auto xl:col-span-3 lg:col-span-4 px-5 lg:px-0 bg-white overflow-y-auto z-40 transition-transform duration-300 ${filtersVisible ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="divide-y divide-gray-100">
                  <div className="py-7 lg:pb-7 flex justify-between items-center">
                    <h4 className="font-semibold text-lg text-gray-800">Filter</h4>
                    <div className="flex gap-3 items-center">
                      <button onClick={resetFilters} className="text-violet-500 font-medium text-sm">
                        Reset All
                      </button>
                      <button
                        onClick={() => setFiltersVisible(false)}
                        className="bg-gray-100 w-9 h-9 lg:hidden rounded-lg text-gray-500 cursor-pointer inline-flex items-center justify-center"
                      >✖</button>
                    </div>
                  </div>

                  {/* Catégorie — filtre dynamique depuis les produits */}
                  <div className="py-7">
                    <p className="font-medium text-base text-gray-800 mb-5">Category</p>
                    <ul className="space-y-3">
                      {[...new Set(products.map(p => p.category))].map(cat => (
                        <li key={cat} className="flex items-center gap-3">
                          <input
                            id={`cat-${cat}`} type="checkbox"
                            className="w-4 h-4 text-violet-500 border-gray-300 rounded focus:ring-0"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleFilter(cat, selectedCategories, setSelectedCategories)}
                          />
                          <label htmlFor={`cat-${cat}`} className="text-sm text-gray-700 cursor-pointer">
                            {cat}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Availability */}
                  <div className="py-7">
                    <p className="font-medium text-base text-gray-800 mb-5">Availability</p>
                    <ul className="space-y-3">
                      {['In stock', 'Out of stock'].map(av => (
                        <li key={av} className="flex items-center gap-3">
                          <input
                            id={`avail-${av}`} type="checkbox"
                            className="w-4 h-4 text-violet-500 border-gray-300 rounded focus:ring-0"
                            checked={selectedAvailability.includes(av)}
                            onChange={() => toggleFilter(av, selectedAvailability, setSelectedAvailability)}
                          />
                          <label htmlFor={`avail-${av}`} className="text-sm text-gray-700 cursor-pointer">
                            {av}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price Slider — identique à ton code */}
                  <div className="py-7">
                    <p className="font-medium text-base text-gray-800 mb-5">Price</p>
                    <div className="flex items-center gap-3 my-6">
                      <div className="flex-1">
                        <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3">
                          <span className="text-gray-500 pr-2">$</span>
                          <input readOnly className="w-full bg-transparent border-l border-l-gray-200 border-0 focus:ring-0 px-2 py-2.5 text-sm font-medium text-gray-800 focus:outline-none" type="text" value={priceMin} />
                        </div>
                      </div>
                      <span className="text-gray-500">to</span>
                      <div className="flex-1">
                        <div className="flex items-center rounded-lg border border-gray-300 bg-white px-3">
                          <span className="text-gray-500 pr-2">$</span>
                          <input readOnly className="w-full bg-transparent border-l border-l-gray-200 border-0 focus:ring-0 px-2 py-2.5 text-sm font-medium text-gray-800 focus:outline-none" type="text" value={priceMax} />
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full h-8 flex items-center">
                      <div className="absolute w-full h-2 rounded-full bg-gray-200" />
                      <div className="absolute h-2 rounded-full bg-indigo-600"
                        style={{ left: `${(priceMin / 2000) * 100}%`, width: `${((priceMax - priceMin) / 2000) * 100}%` }}
                      />
                      <input min="0" max="2000" type="range" value={priceMin}
                        onChange={e => setPriceMin(Number(e.target.value))}
                        className="range-thumb" style={{ zIndex: 3 }} />
                      <input min="0" max="2000" type="range" value={priceMax}
                        onChange={e => setPriceMax(Number(e.target.value))}
                        className="range-thumb" style={{ zIndex: 4 }} />
                    </div>
                  </div>
                </div>
              </aside>

              {/* ── Liste produits ────────────────────────────────────────── */}
              <div className="lg:col-span-8 xl:col-span-9 flex flex-col">

                {/* Barre de tri */}
                <div className="pb-4 lg:flex items-center justify-between hidden">
                  <p className="text-gray-500 text-base">
                    Showing {paginated.length} of {filtered.length} Results
                  </p>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="rounded-lg bg-transparent text-sm font-medium cursor-pointer focus:outline-none text-gray-500"
                  >
                    <option>Best selling</option>
                    <option>Featured</option>
                    <option>Price, Low to high</option>
                    <option>Price, high to low</option>
                    <option>Alphabetically, A-Z</option>
                    <option>Alphabetically, Z-A</option>
                  </select>
                </div>

                {/* Mobile sort */}
                <div className="block lg:hidden">
                  <div className="border border-gray-200 p-5 rounded-xl flex justify-between items-center">
                    <button onClick={() => setFiltersVisible(true)}
                      className="rounded-lg border border-gray-200 py-2.5 px-3.5 font-medium text-sm text-gray-800 h-10">
                      Filter
                    </button>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                      className="rounded-lg border border-gray-200 py-2.5 px-3.5 font-medium text-sm text-gray-800 h-10">
                      <option>Best selling</option>
                      <option>Featured</option>
                      <option>Price, Low to high</option>
                      <option>Price, high to low</option>
                    </select>
                  </div>
                  <p className="text-gray-500 text-base py-5 text-center">
                    Showing {paginated.length} of {filtered.length} Results
                  </p>
                </div>

                {/* Loading */}
                {loading && (
                  <div className="flex justify-center items-center h-60">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500" />
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="text-center text-red-500 py-20">
                    <p className="text-lg font-medium">{error}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Assurez-vous que le backend tourne sur localhost:8081
                    </p>
                  </div>
                )}

                {/* Grille produits */}
                {!loading && !error && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginated.map(product => (
                      <ProductCard
                        key={product.id}
                        {...product}
                        onAddToCart={addToCart}
                      />
                    ))}
                  </div>
                )}

                {/* Vide */}
                {!loading && !error && paginated.length === 0 && (
                  <div className="text-center py-20 text-gray-400">
                    Aucun produit ne correspond aux filtres
                  </div>
                )}

                {/* Pagination dynamique */}
                {!loading && totalPages > 1 && (
                  <div className="flex justify-center items-center mt-10 gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 h-10 rounded-lg flex gap-1.5 items-center justify-center border font-medium transition-all border-gray-200 text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      ← Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          page === currentPage
                            ? 'bg-violet-500 text-white shadow-sm'
                            : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 h-10 rounded-lg flex gap-1.5 items-center justify-center border font-medium transition-all border-gray-200 text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    </>
  );
}
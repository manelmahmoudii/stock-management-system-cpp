// src/pages/ShopPage.jsx
import { useState } from 'react';
import ProductCard from '../../componentsClient/ProductCard';

import Header from '../../componentsClient/Header';    // ← ajoute
import Footer from '../../componentsClient/Footer';  
import CartDrawer from '../../componentsClient/CartDrawer';  // nouveau

// Images (à adapter selon vos chemins réels)

import productImg1 from '../../../public/client/imagesClient/products/image-1.png'
import productImg2 from '../../../public/client/imagesClient/products/image-2.png';
import productImg3 from '../../../public/client/imagesClient/products/image-3.png';
import productImg4 from '../../../public/client/imagesClient/products/image-4.png';
import productImg5 from '../../../public/client/imagesClient/products/image-5.png';
import productImg6 from '../../../public/client/imagesClient/products/image-6.png';
import productImg7 from '../../../public/client/imagesClient/products/image-7.png';
import productImg8 from '../../../public/client/imagesClient/products/image-8.png';

const allProducts = [
  { id: 1, name: 'Meta Quest 2 VR Headset', price: 399, image: productImg1, badge: 'New', badgeColor: 'green' },
  { id: 2, name: 'DJI Mini 3 Pro Drone', price: 399, image: productImg2, badge: 'New', badgeColor: 'green' },
  { id: 3, name: 'Razer DeathAdder Mouse', price: 399, image: productImg3 },
  { id: 4, name: 'ASUS ROG Zephyrus 14', price: 349, oldPrice: 499, image: productImg4, badge: '20% OFF', badgeColor: 'violet' },
  { id: 5, name: 'iPhone 16', price: 799, oldPrice: 999, image: productImg5, badge: '15% OFF', badgeColor: 'violet' },
  { id: 6, name: 'Apple Watch Series 9', price: 399, image: productImg6, badge: 'New', badgeColor: 'green' },
  { id: 7, name: 'Logitech G213 Keyboard', price: 399, image: productImg7 },
  { id: 8, name: 'JBL 305P MkII Studio', price: 169, image: productImg8, badge: 'Best Choice', badgeColor: 'blue' },
  { id: 9, name: 'Sony WH-1000XM5', price: 349, image: productImg1, badge: 'New', badgeColor: 'green' },
];

export default function ShopPage() {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1278);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('Best selling');
//nb de page 
  const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 6;


   // État du panier
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    setIsCartOpen(true); // ouvre le panier après ajout
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

  // Gestion des checkboxes
  const toggleFilter = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setPriceMin(0);
    setPriceMax(1278);
    setSelectedCategories([]);
    setSelectedAvailability([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  // Filtrer et trier les produits
  let filteredProducts = allProducts.filter(product => {
    if (product.price < priceMin || product.price > priceMax) return false;
    // Ajoutez ici les autres filtres (catégorie, marque, etc.) selon vos besoins
    return true;
  });

  // Tri
  if (sortBy === 'Price, Low to high') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price, high to low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'Alphabetically, A-Z') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'Alphabetically, Z-A') {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }
  // "Best selling" et "Featured" pas de tri particulier

  return (
    <>
          <Header />

    <main>
      {/* Breadcrumb & titre */}
      <section className="lg:pt-20 pt-14 pb-10 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="mx-auto max-w-lg mb-4 text-center">
            <h1 className="text-4xl lg:text-5xl font-medium text-gray-900 mb-4">Shop all</h1>
            <p className="text-base text-gray-500">Our most-loved gadgets, trusted by thousands of customers.</p>
          </div>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm">
              <li className="inline-flex items-center">
                <a className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900" href="/client">Home</a>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M5.83333 12.6667L10 8.50008L5.83333 4.33341" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </li>
              <li className="inline-flex items-center">
                <a className="inline-flex items-center gap-1 font-medium text-gray-900" href="/shop">Shop</a>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="bg-white pb-10 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Filtre latéral */}
            <aside className={`fixed top-0 left-0 h-full w-80 lg:rounded-xl lg:translate-x-0 lg:static lg:w-auto xl:col-span-3 lg:col-span-4 px-5 lg:px-0 bg-white overflow-y-auto z-40 transition-transform duration-300 ${filtersVisible ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
              <div className="divide-y divide-gray-100">
                <div className="py-7 lg:pb-7 flex justify-between items-center">
                  <h4 className="font-semibold text-lg text-gray-800">Filter</h4>
                  <div className="flex gap-3 items-center">
                    <button onClick={resetFilters} className="text-violet-500 font-medium text-sm">Reset All</button>
                    <button onClick={() => setFiltersVisible(false)} className="bg-gray-100 w-9 h-9 lg:hidden rounded-lg text-gray-500 cursor-pointer inline-flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.805 15.0724L13.7366 15.0109L9.99907 11.2734L6.26156 15.0109C5.91009 15.3624 5.33969 15.3624 4.98821 15.0109C4.63674 14.6594 4.63674 14.089 4.98821 13.7376L8.72573 10L4.98821 6.26253C4.63674 5.91106 4.63674 5.34066 4.98821 4.98919C5.33969 4.63772 5.91009 4.63772 6.26156 4.98919L9.99907 8.7267L13.7366 4.98919L13.805 4.92773C14.1584 4.63936 14.6797 4.66035 15.0092 4.98988C15.3388 5.3194 15.3598 5.84067 15.0714 6.19417L15.0099 6.26253L11.2724 10L15.0099 13.7376L15.0714 13.8059C15.3598 14.1594 15.3388 14.6807 15.0092 15.0102C14.6797 15.3397 14.1584 15.3607 13.805 15.0724Z" fill="currentColor"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Catégorie */}
                <div className="py-7">
                  <button className="w-full flex justify-between items-center cursor-pointer font-medium text-base text-left text-gray-800 transition">Product Category
                    <svg className="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75V11.25ZM18.0007 12.75C18.4149 12.75 18.7507 12.4142 18.7507 12C18.7507 11.5858 18.4149 11.25 18.0007 11.25V12.75ZM6 12V12.75H18.0007V12V11.25H6V12Z" fill="currentColor"></path>
                    </svg>
                  </button>
                  <div className="mt-5">
                    <ul className="space-y-3">
                      {['Mens', 'Women', 'Kids', 'Shoes', 'Accessories'].map(cat => (
                        <li key={cat} className="flex items-center gap-3">
                          <input id={`cat-${cat}`} type="checkbox" className="w-4 h-4 text-violet-500 bg-white checked:bg-violet-500 border-gray-300 rounded focus:ring-0" checked={selectedCategories.includes(cat)} onChange={() => toggleFilter(cat, selectedCategories, setSelectedCategories)} />
                          <label htmlFor={`cat-${cat}`} className="text-sm text-gray-700 cursor-pointer">{cat}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Availability */}
                <div className="py-7">
                  <button className="w-full flex justify-between items-center cursor-pointer font-medium text-base text-left text-gray-800 transition">Availability
                    <svg className="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75V11.25ZM18.0007 12.75C18.4149 12.75 18.7507 12.4142 18.7507 12C18.7507 11.5858 18.4149 11.25 18.0007 11.25V12.75ZM6 12V12.75H18.0007V12V11.25H6V12Z" fill="currentColor"></path>
                    </svg>
                  </button>
                  <div className="mt-5">
                    <ul className="space-y-3">
                      {['In stock', 'Out of stock'].map(av => (
                        <li key={av} className="flex items-center gap-3">
                          <input id={`avail-${av}`} type="checkbox" className="w-4 h-4 text-violet-500 bg-white checked:bg-violet-500 border-gray-300 rounded focus:ring-0" checked={selectedAvailability.includes(av)} onChange={() => toggleFilter(av, selectedAvailability, setSelectedAvailability)} />
                          <label htmlFor={`avail-${av}`} className="text-sm text-gray-700 cursor-pointer">{av}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price Slider */}
                <div className="py-7">
                  <button className="w-full flex justify-between items-center cursor-pointer font-medium text-base text-left text-gray-800 transition">Price
                    <svg className="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75V11.25ZM18.0007 12.75C18.4149 12.75 18.7507 12.4142 18.7507 12C18.7507 11.5858 18.4149 11.25 18.0007 11.25V12.75ZM6 12V12.75H18.0007V12V11.25H6V12Z" fill="currentColor"></path>
                    </svg>
                  </button>
                  <div className="mt-5">
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
                      <div className="absolute w-full h-2 rounded-full bg-gray-200"></div>
                      <div className="absolute h-2 rounded-full bg-indigo-600" style={{ left: `${(priceMin / 2000) * 100}%`, width: `${((priceMax - priceMin) / 2000) * 100}%` }}></div>
                      <input min="0" max="2000" type="range" value={priceMin} onChange={(e) => setPriceMin(Number(e.target.value))} className="range-thumb" style={{ zIndex: 3 }} />
                      <input min="0" max="2000" type="range" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="range-thumb" style={{ zIndex: 4 }} />
                    </div>
                    <style jsx>{`
                      .range-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        pointer-events: none;
                        position: absolute;
                        height: 0;
                        width: 100%;
                        outline: none;
                        background: transparent;
                      }
                      .range-thumb::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        pointer-events: auto;
                        width: 22px;
                        height: 22px;
                        border-radius: 50%;
                        border: 3px solid #4f46e5;
                        background-color: #ffffff;
                        cursor: pointer;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                      }
                      .range-thumb::-moz-range-thumb {
                        pointer-events: auto;
                        width: 22px;
                        height: 22px;
                        border-radius: 50%;
                        border: 3px solid #4f46e5;
                        background-color: #ffffff;
                        cursor: pointer;
                      }
                    `}</style>
                  </div>
                </div>

                {/* Brand */}
                <div className="py-7">
                  <button className="w-full flex justify-between items-center cursor-pointer font-medium text-base text-left text-gray-800 transition">Brand
                    <svg className="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75V11.25ZM18.0007 12.75C18.4149 12.75 18.7507 12.4142 18.7507 12C18.7507 11.5858 18.4149 11.25 18.0007 11.25V12.75ZM6 12V12.75H18.0007V12V11.25H6V12Z" fill="currentColor"></path>
                    </svg>
                  </button>
                  <div className="mt-5">
                    <ul className="space-y-3">
                      {['Aymar', 'Angel', 'Burberry', 'Eliza J', 'Sanok'].map(brand => (
                        <li key={brand} className="flex items-center gap-3">
                          <input id={`brand-${brand}`} type="checkbox" className="w-4 h-4 text-violet-500 bg-white checked:bg-violet-500 border-gray-300 rounded focus:ring-0" checked={selectedBrands.includes(brand)} onChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)} />
                          <label htmlFor={`brand-${brand}`} className="text-sm text-gray-700 cursor-pointer">{brand}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Color */}
                <div className="py-7">
                  <button className="w-full flex justify-between items-center cursor-pointer font-medium text-base text-left text-gray-800 transition">Color
                    <svg className="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75V11.25ZM18.0007 12.75C18.4149 12.75 18.7507 12.4142 18.7507 12C18.7507 11.5858 18.4149 11.25 18.0007 11.25V12.75ZM6 12V12.75H18.0007V12V11.25H6V12Z" fill="currentColor"></path>
                    </svg>
                  </button>
                  <div className="mt-5">
                    <ul className="space-y-3">
                      {[
                        { name: 'Black', colorClass: 'bg-black ring-black' },
                        { name: 'White', colorClass: 'bg-white ring-gray-200' },
                        { name: 'Blue', colorClass: 'bg-blue-700 ring-blue-700' },
                        { name: 'Red', colorClass: 'bg-red-700 ring-red-700' },
                        { name: 'Green', colorClass: 'bg-green-700 ring-green-700' },
                      ].map(color => (
                        <li key={color.name} className="flex items-center gap-3">
                          <input id={`color-${color.name}`} type="checkbox" className="w-4 h-4 text-violet-500 bg-white checked:bg-violet-500 border-gray-300 rounded focus:ring-0" checked={selectedColors.includes(color.name)} onChange={() => toggleFilter(color.name, selectedColors, setSelectedColors)} />
                          <label htmlFor={`color-${color.name}`} className="text-sm text-gray-500 flex items-center cursor-pointer">
                            <span className={`${color.colorClass} ring-1 rounded-full w-3.5 h-3.5 inline-block mr-1`}></span>
                            {color.name}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Size */}
                <div className="py-7">
                  <button className="w-full flex justify-between items-center cursor-pointer font-medium text-base text-left text-gray-800 transition">Size
                    <svg className="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75V11.25ZM18.0007 12.75C18.4149 12.75 18.7507 12.4142 18.7507 12C18.7507 11.5858 18.4149 11.25 18.0007 11.25V12.75ZM6 12V12.75H18.0007V12V11.25H6V12Z" fill="currentColor"></path>
                    </svg>
                  </button>
                  <div className="mt-5">
                    <ul className="space-y-3">
                      {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                        <li key={size} className="flex items-center justify-between">
                          <div className="grow flex items-center gap-3">
                            <input id={`size-${size}`} type="checkbox" className="w-4 h-4 text-violet-500 bg-white checked:bg-violet-500 border-gray-300 rounded focus:ring-0" checked={selectedSizes.includes(size)} onChange={() => toggleFilter(size, selectedSizes, setSelectedSizes)} />
                            <label htmlFor={`size-${size}`} className="text-sm text-gray-700 cursor-pointer">{size}</label>
                          </div>
                          <span className="text-xs text-gray-500">{Math.floor(Math.random() * 90) + 10}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </aside>

            {/* Liste des produits */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
              {/* Barre de tri (desktop) */}
              <div className="pb-4 lg:flex items-center justify-between hidden">
                <div><p className="text-gray-500 text-base">Showing 1-{filteredProducts.length} of {filteredProducts.length} Results</p></div>
                <div className="relative shrink-0">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg bg-transparent text-sm font-medium cursor-pointer focus:outline-none text-gray-500">
                    <option value="Best selling">Best selling</option>
                    <option value="Featured">Featured</option>
                    <option value="Price, Low to high">Price, Low to high</option>
                    <option value="Price, high to low">Price, high to low</option>
                    <option value="Alphabetically, A-Z">Alphabetically, A-Z</option>
                    <option value="Alphabetically, Z-A">Alphabetically, Z-A</option>
                  </select>
                </div>
              </div>

              {/* Filtres mobiles */}
              <div className="block lg:hidden">
                <div className="border border-gray-200 p-5 rounded-xl flex justify-between items-center">
                  <button onClick={() => setFiltersVisible(true)} className="rounded-lg border border-gray-200 py-2.5 px-3.5 font-medium text-sm text-gray-800 h-10 flex gap-1.5 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
                      <path d="M0.75 2.54102C0.75 1.85066 1.30964 1.29102 2 1.29102H11.375C12.0654 1.29102 12.625 1.85066 12.625 2.54102V3.67479C12.625 4.22313 12.4447 4.75627 12.1119 5.19207L8.50654 9.9134C8.34014 10.1313 8.25 10.3979 8.25 10.672V15.8706C8.25 16.5184 7.54336 16.9185 6.98792 16.5852L5.73188 15.8316C5.35537 15.6057 5.125 15.1988 5.125 14.7597V10.672C5.125 10.3979 5.03486 10.1313 4.86846 9.9134L1.26308 5.19207C0.930283 4.75627 0.75 4.22313 0.75 3.67479V2.54102Z" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    Filter
                  </button>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-gray-200 py-2.5 px-3.5 font-medium text-sm text-gray-800 h-10">
                    <option value="Featured">Sort</option>
                    <option value="Featured">Featured</option>
                    <option value="Best selling">Best selling</option>
                    <option value="Price, Low to high">Price, Low to high</option>
                    <option value="Price, high to low">Price, high to low</option>
                    <option value="Alphabetically, A-Z">Alphabetically, A-Z</option>
                    <option value="Alphabetically, Z-A">Alphabetically, Z-A</option>
                  </select>
                </div>
                <p className="text-gray-500 text-base py-5 text-center">Showing 1-{filteredProducts.length} of {filteredProducts.length} Results</p>
              </div>

              {/* Grille produits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} {...product} onAddToCart={addToCart} />
          ))}
        </div>


              {/* Pagination */}
              <div className="flex justify-center items-center mt-10 gap-2">
                <button disabled className="px-4 h-10 rounded-lg flex gap-1.5 cursor-pointer items-center justify-center border font-medium transition-all border-gray-200 text-gray-400 cursor-not-allowed">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5">
                    <path d="M3.99976 11.9966L20.0011 11.9966M9.99575 6L3.99976 11.9998L9.99575 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  Prev
                </button>
                {[1, 2, 3, 4].map(page => (
                  <button key={page} className={`w-10 h-10 rounded-lg cursor-pointer font-medium transition-all ${page === 1 ? 'bg-violet-500 text-white shadow-sm' : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'}`}>
                    {page}
                  </button>
                ))}
                <button className="px-4 h-10 rounded-lg flex cursor-pointer gap-1.5 items-center justify-center border font-medium transition-all border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300">
                  Next
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5">
                    <path d="M19.7226 11.9966L3.72125 11.9966M13.7266 6L19.7226 11.9998L13.7266 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
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


    </>
  );
}
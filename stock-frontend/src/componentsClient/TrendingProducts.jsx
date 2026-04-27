// src/components/TrendingProducts.jsx
import ProductCard from './ProductCard';
import product1 from '/client/imagesClient/products/image-1.png';
import product2 from '/client/imagesClient/products/image-2.png';
import product3 from '/client/imagesClient/products/image-3.png';
import product4 from '/client/imagesClient/products/image-4.png';

const products = [
  { id: 1, name: 'VR Headset Pro', price: 399, image: product1, badge: 'New', badgeColor: 'green' },
  { id: 2, name: 'DJI Mini Pro', price: 399, image: product2, badge: 'New', badgeColor: 'green' },
  { id: 3, name: 'Gaming Mouse', price: 399, image: product3 },
  { id: 4, name: 'Gaming Laptop', price: 349, oldPrice: 499, image: product4, badge: '20% OFF', badgeColor: 'violet' },
];

export default function TrendingProducts({ onAddToCart }) {   // ✅ ajout de la prop
  return (
    <section className="py-10 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-end justify-between mb-16">
          <div className="text-left lg:max-w-lg">
            <h2 className="mb-2 text-5xl font-medium text-gray-800 -tracking-[1.92px]">Trending Now</h2>
            <p className="text-base text-gray-500">Our most-loved gadgets, trusted by thousands of customers.</p>
          </div>
          <div className="flex sm:justify-end">
            <a className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-4 py-2.5 text-white font-medium transition hover:bg-violet-600" href="/shop">Explore All</a>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-11 gap-x-6">
          {products.map(product => (
            <ProductCard key={product.id} {...product} onAddToCart={onAddToCart} />   // ✅ transmission
          ))}
        </div>
      </div>
    </section>
  );
}
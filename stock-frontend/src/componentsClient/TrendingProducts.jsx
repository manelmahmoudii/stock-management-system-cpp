// src/componentsClient/TrendingProducts.jsx
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';

// Images de fallback si le backend n'en a pas
import product1 from '/client/imagesClient/products/image-1.png';
import product2 from '/client/imagesClient/products/image-2.png';
import product3 from '/client/imagesClient/products/image-3.png';
import product4 from '/client/imagesClient/products/image-4.png';

const fallbackImages = [product1, product2, product3, product4];

export default function TrendingProducts({ onAddToCart }) {
  const { products, loading, error } = useProducts();

  const trending = products.slice(0, 4).map((p, i) => ({
    ...p,
    // Utiliser l'image du backend si disponible, sinon fallback
    image: p.image && p.image !== "" ? p.image : fallbackImages[i % fallbackImages.length],
  }));

  return (
    <section className="py-10 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-end justify-between mb-16">
          <div className="text-left lg:max-w-lg">
            <h2 className="mb-2 text-5xl font-medium text-gray-800 -tracking-[1.92px]">
              Trending Now
            </h2>
            <p className="text-base text-gray-500">
              Our most-loved gadgets, trusted by thousands of customers.
            </p>
          </div>
          <div className="flex sm:justify-end">
            <a
              className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-4 py-2.5 text-white font-medium transition hover:bg-violet-600"
              href="/shop"
            >
              Explore All
            </a>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-10">
            <p>{error}</p>
            <p className="text-sm text-gray-400 mt-1">
              Vérifiez que le backend tourne sur localhost:8081
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-11 gap-x-6">
            {trending.map(product => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}

        {!loading && !error && trending.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            Aucun produit disponible
          </p>
        )}
      </div>
    </section>
  );
}
// src/components/ProductCard.jsx
import { useState } from 'react';

export default function ProductCard({ id, name, price, oldPrice, image, badge, badgeColor = 'green' , onAddToCart}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const badgeClasses = {
    green: 'bg-green-50 text-green-700',
    violet: 'bg-violet-50 text-violet-700',
    blue: 'bg-blue-50 text-blue-700',  

  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <div className="bg-gray-50 block mb-5 rounded-xl relative group overflow-hidden">
        <a className="block overflow-hidden rounded-xl relative z-10" href={`/product/${id}`}>
          {badge && (
            <span className={`absolute top-4 left-4 ${badgeClasses[badgeColor]} inline-flex items-center justify-center h-5 rounded-full px-2 py-1 text-sm font-medium z-10`}>
              {badge}
            </span>
          )}
          <img className="product-img w-full h-60 object-contain" alt={name} src={image} />
        </a>

        {/* Actions flottantes */}
        <div className={`absolute top-4 right-4 z-20 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="size-11 rounded-full border cursor-pointer inline-flex items-center justify-center transition-colors duration-200 bg-white border-gray-300 hover:bg-violet-50 hover:border-violet-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill={isLiked ? 'currentColor' : 'none'}>
              <path d="M3.51311 4.41851C1.88463 6.04699 1.88463 8.68728 3.51311 10.3158L9.11618 15.9189C9.60433 16.4071 10.3958 16.4071 10.884 15.9189L16.487 10.3158C18.1155 8.68737 18.1155 6.04707 16.487 4.41859C14.8586 2.79011 12.2183 2.79011 10.5898 4.41859L10.0001 5.00826L9.41037 4.4185C7.78188 2.79002 5.14159 2.79002 3.51311 4.41851Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          <a className="size-11 rounded-full border bg-white cursor-pointer border-gray-300 inline-flex items-center justify-center hover:bg-violet-50 hover:border-violet-300 transition-colors duration-200" href={`/product/${id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M2.95862 12.9509C2.68046 12.3478 2.68046 11.6522 2.95862 11.0491C4.53779 7.62518 7.99237 5.24988 11.9999 5.24988C16.0075 5.24988 19.4621 7.62519 21.0413 11.0491C21.3194 11.6522 21.3194 12.3478 21.0413 12.9509C19.4621 16.3748 16.0075 18.7501 11.9999 18.7501C7.99237 18.7501 4.53779 16.3748 2.95862 12.9509Z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M15.625 11.9999C15.625 14.0019 14.002 15.6249 12 15.6249C9.99797 15.6249 8.375 14.0019 8.375 11.9999C8.375 9.99785 9.99797 8.37488 12 8.37488C14.002 8.37488 15.625 9.99785 15.625 11.9999Z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </a>
          <button className="size-11 rounded-full border bg-white cursor-pointer border-gray-300 inline-flex items-center justify-center hover:bg-violet-50 hover:border-violet-300 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18.751 7.37695L5.25098 7.37695M15.3763 4.00098L18.749 7.37587L15.3763 10.751M5.24902 16.625H18.749M8.62373 20.001L5.25098 16.6261L8.62373 13.251" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </div>

         <button
        onClick={() => onAddToCart({ id, name, price, image })}
        className="absolute left-3 right-3 bottom-3 z-30 rounded-lg bg-violet-500 px-4 py-2.5 text-base font-medium text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-violet-600 cursor-pointer pointer-events-none group-hover:pointer-events-auto"
      >
        Add to cart
      </button>
      
      </div>

      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-900">
          <a href={`/product/${id}`}>{name}</a>
        </h3>
        {oldPrice ? (
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-500 line-through">${oldPrice}</span>
            <span className="text-base font-semibold text-gray-900">${price}</span>
          </div>
        ) : (
          <span className="text-base text-gray-500">${price}</span>
        )}
      </div>
    </article>
  );
}
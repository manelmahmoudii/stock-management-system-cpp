// src/componentsClient/CartDrawer.jsx
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose, cartItems, updateQuantity, removeItem }) {
  // Calcul du sous-total et total
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  if (!isOpen) return null;

  return (
    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 z-50">
      <div className="pointer-events-auto w-screen max-w-md">
        <div className="flex h-full flex-col px-4 py-6 sm:px-6 bg-white shadow-xl">
          {/* En-tête */}
          <div className="flex items-center justify-between border-b pb-6 border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">Your Cart ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})</h2>
            <div className="ml-3 flex h-7 items-center">
              <button
                type="button"
                onClick={onClose}
                className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Close panel</span>
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Liste des articles */}
          <div className="flex-1 overflow-y-auto pt-6">
            <div className="flow-root">
              <ul className="divide-y divide-dashed divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex first:pt-0 justify-between last:pb-0 py-5">
                    <div className="flex">
                      <div className="mr-4 shrink-0 bg-gray-50 rounded-lg">
                        <img className="rounded-lg w-21 h-24 object-cover" alt={item.name} src={item.image} />
                      </div>
                      <div className="grow space-y-4">
                        <div>
                          <h3 className="text-sm text-gray-800 line-clamp-1 font-semibold">{item.name}</h3>
                          <div className="flex flex-wrap items-center space-x-2">
                            <p className="text-gray-500 text-sm">{item.color || 'white'}</p>
                            <span className="text-gray-300">
                              <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none">
                                <circle cx="2.33301" cy="2" r="1.5" fill="#D1D5DB"></circle>
                              </svg>
                            </span>
                            <p className="text-gray-500 text-sm">{item.storage || '128 GB'}</p>
                          </div>
                        </div>
                        <div className="flex w-[130px] mt-4 divide-gray-200 divide-x h-10 rounded-lg border border-gray-200 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M5 9.25C4.59 9.25 4.25 9.59 4.25 10C4.25 10.41 4.59 10.75 5 10.75H15C15.41 10.75 15.75 10.41 15.75 10C15.75 9.59 15.41 9.25 15 9.25H5Z" fill="currentColor"></path>
                            </svg>
                          </button>
                          <div className="flex-1 flex items-center justify-center">{item.quantity}</div>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 flex text-gray-500 items-center justify-center hover:bg-gray-100 transition"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M10 4.25C10.41 4.25 10.75 4.59 10.75 5V9.25H15C15.41 9.25 15.75 9.59 15.75 10C15.75 10.41 15.41 10.75 15 10.75H10.75V15C10.75 15.41 10.41 15.75 10 15.75C9.59 15.75 9.25 15.41 9.25 15V10.75H5C4.59 10.75 4.25 10.41 4.25 10C4.25 9.59 4.59 9.25 5 9.25H9.25V5C9.25 4.59 9.59 4.25 10 4.25Z" fill="currentColor"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <p className="text-sm text-gray-700 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M5.25 5.75V19.75C5.25 20.5784 5.92157 21.25 6.75 21.25H17.25C18.0784 21.25 18.75 20.5784 18.75 19.75V5.75M4 5.75H19.999M5.25 15.8955V9.89551M18.75 15.8955V9.89551M10 16.5V10.5M14 16.5V10.5M15.2495 5.75V4.25C15.2495 3.42157 14.5779 2.75 13.7495 2.75H10.2495C9.42108 2.75 8.74951 3.42157 8.74951 4.25V5.75H15.2495Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
                {cartItems.length === 0 && (
                  <li className="py-8 text-center text-gray-500">Your cart is empty.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Pied (total et actions) */}
          <div className="border-t border-gray-100 py-6">
            <div className="flex justify-between text-base">
              <p className="font-normal text-gray-500">Subtotal</p>
              <p className="text-gray-500">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
            <div className="mt-6">
              <button
                onClick={onClose}
                className="flex w-full items-center h-11 justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Continue Shopping
              </button>
            </div>
            <div className="mt-2">
              <Link
                to="/checkout"
                className="flex w-full items-center justify-center rounded-lg border border-transparent bg-violet-500 px-6 py-3 text-base font-medium text-white h-11 hover:bg-violet-600"
              >
                Process to checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
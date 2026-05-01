import { useState } from "react";
import { useProducts } from "../hooks/useProducts";

export default function DeliveryManagement() {
  const { products, deliverProduct, loading, refreshProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState("all");
  const [deliveringId, setDeliveringId] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState(10);
  
  const needsRestock = products.filter(p => p.quantity <= p.minThreshold);
  const outOfStock = products.filter(p => p.quantity === 0);
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.minThreshold);
  
  const getFilteredProducts = () => {
    switch(filter) {
      case "lowStock": return lowStock;
      case "outOfStock": return outOfStock;
      default: return needsRestock;
    }
  };
  
  const filteredProducts = getFilteredProducts();
  
  const handleRestock = async (productId, quantity, productName) => {
    if (!quantity || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    
    setDeliveringId(productId);
    try {
      await deliverProduct(productId, quantity);
      await refreshProducts();
      alert(`✅ ${productName} restocked successfully!`);
      setSelectedProduct(null);
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setDeliveringId(null);
    }
  };
  
  const openRestockModal = (product) => {
    setSelectedProduct(product);
    setRestockQuantity(Math.max(product.minThreshold * 2, 10));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500" />
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          📦 Delivery Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Restock products that are low or out of stock
        </p>
      </div>
      
      {/* Statistics Cards - White/Dark background with colored icons only */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Out of Stock</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{outOfStock.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Low Stock</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{lowStock.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Stock OK</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                {products.length - needsRestock.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === "all" 
              ? "bg-brand-500 text-white" 
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          All to restock ({needsRestock.length})
        </button>
        <button
          onClick={() => setFilter("lowStock")}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
            filter === "lowStock" 
              ? "bg-yellow-500 text-white" 
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Low Stock ({lowStock.length})
        </button>
        <button
          onClick={() => setFilter("outOfStock")}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
            filter === "outOfStock" 
              ? "bg-red-500 text-white" 
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Out of Stock ({outOfStock.length})
        </button>
      </div>
      
      {/* Products List - Colorful cards with dark mode support */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <svg className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No products need restocking</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">All stock levels are good! 🎉</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map(product => {
            const isOutOfStock = product.quantity === 0;
            const recommendedQty = Math.max(product.minThreshold * 2, 10);
            
            return (
              <div
                key={product.id}
                className={`rounded-xl border-2 p-5 transition-all hover:shadow-lg ${
                  isOutOfStock 
                    ? "border-red-300 dark:border-red-800 bg-gradient-to-r from-red-50 to-white dark:from-red-950/30 dark:to-gray-900" 
                    : "border-yellow-300 dark:border-yellow-800 bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-950/30 dark:to-gray-900"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {isOutOfStock ? (
                        <div className="w-8 h-8 bg-red-200 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-yellow-200 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {product.name}
                      </h3>
                      {isOutOfStock ? (
                        <span className="text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded-full">
                          ⚠️ Out of Stock
                        </span>
                      ) : (
                        <span className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 px-2 py-0.5 rounded-full">
                          📉 Low Stock
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Current Stock</span>
                        <p className={`font-bold text-xl ${isOutOfStock ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                          {product.quantity}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Min Threshold</span>
                        <p className="font-bold text-gray-700 dark:text-gray-300">{product.minThreshold}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Unit Price</span>
                        <p className="font-bold text-gray-700 dark:text-gray-300">${product.price}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Missing</span>
                        <p className="font-bold text-red-500 dark:text-red-400">
                          {Math.max(0, product.minThreshold - product.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Restock Button */}
                  <button
                    onClick={() => {
                      const qty = prompt(
                        `Enter quantity to restock for ${product.name}:`,
                        recommendedQty
                      );
                      if (qty && parseInt(qty) > 0) {
                        handleRestock(product.id, parseInt(qty), product.name);
                      }
                    }}
                    disabled={deliveringId === product.id}
                    className="px-5 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition font-medium flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                  >
                    {deliveringId === product.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Restock
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct, loading: productsLoading } = useProducts();
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    minThreshold: "5"
  });

  // Charger les données du produit à modifier
  useEffect(() => {
    const loadProduct = async () => {
      setLoadingProduct(true);
      // Attendre que les produits soient chargés
      if (!productsLoading && products.length > 0) {
        const product = products.find(p => p.id === parseInt(id));
        if (product) {
          setFormData({
            name: product.name || "",
            category: product.category || "",
            price: product.price?.toString() || "",
            quantity: product.quantity?.toString() || "",
            minThreshold: product.minThreshold?.toString() || "5"
          });
        } else {
          alert("Produit non trouvé");
          navigate("/ProductsAdmin");
        }
        setLoadingProduct(false);
      } else if (!productsLoading && products.length === 0) {
        // Si pas de produits, attendre un peu ou rediriger
        setTimeout(() => {
          const found = products.find(p => p.id === parseInt(id));
          if (!found) {
            alert("Produit non trouvé");
            navigate("/ProductsAdmin");
          }
          setLoadingProduct(false);
        }, 1000);
      }
    };

    loadProduct();
  }, [id, products, productsLoading, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProduct(id, formData);
      alert("Produit modifié avec succès !");
      navigate("/ProductsAdmin");
    } catch (error) {
      alert("Erreur lors de la modification : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct || productsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500" />
        <span className="ml-3 text-gray-600">Chargement du produit...</span>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-2xl) md:p-6 md:pb-24">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Edit Product
        </h2>

        <nav>
          <ol className="flex items-center gap-1.5">
            <Link
              to="/ProductsAdmin"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            >
              Back
              <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none">
                <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <li className="text-sm text-gray-800 dark:text-white/90">
              Edit Product #{id}
            </li>
          </ol>
        </nav>
      </div>

      <div className="space-y-6">
        {/* Product Description */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Edit Product Information
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                
                {/* Product Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                    className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Category *
                  </label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-lg border px-4 py-2.5 bg-transparent border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <option value="">Select a category</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Phone">Phone</option>
                    <option value="Watch">Watch</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Audio">Audio</option>
                    <option value="Camera">Camera</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="Enter price"
                    className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="Enter quantity"
                    className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>

                {/* Min Threshold */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Minimum Stock Threshold
                  </label>
                  <input
                    type="number"
                    name="minThreshold"
                    value={formData.minThreshold}
                    onChange={handleChange}
                    min="0"
                    placeholder="Alert when stock below"
                    className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    You will be alerted when stock falls below this number
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/ProductsAdmin")}
                  className="px-5 py-3.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3.5 text-sm rounded-lg bg-violet-500 text-white hover:bg-violet-600 disabled:bg-violet-300 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
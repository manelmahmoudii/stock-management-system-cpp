// components/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
const { createProduct, updateProduct, products } = useProducts();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    minThreshold: "5",
  });

  const isEditMode = !!id;

  // Chargement des données en mode édition
   useEffect(() => {
  if (isEditMode) {
    const product = products.find((p) => p.id === parseInt(id) || p.id === id);
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        quantity: product.quantity || "",
        minThreshold: product.minThreshold || "5",
      });
    } else if (products.length > 0) {
      // Produits chargés mais ID introuvable
      alert("Produit introuvable");
      navigate("/ProductsAdmin");
    }
  }
}, [id, isEditMode, products, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    if (isEditMode) {
      // Update direct via API
      const response = await fetch(`http://localhost:8081/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      alert("Produit modifié avec succès !");
    } else {
      await createProduct(formData);
      alert("Produit créé avec succès !");
    }
    navigate("/ProductsAdmin");
  } catch (error) {
    alert(`Erreur : ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  // Affichage d'un loader pendant le chargement des données (édition)
  if (isEditMode && loading) {
    return (
      <div className="p-4 text-center">
        Chargement du produit...
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-2xl) md:p-6 md:pb-24">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {isEditMode ? "Edit Product" : "Add Product"}
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
              {isEditMode ? "Edit Product" : "Add Product"}
            </li>
          </ol>
        </nav>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Products Description
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
                    placeholder="Alert when stock below"
                    className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/ProductsAdmin")}
                  className="px-5 py-3.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3.5 text-sm rounded-lg bg-violet-500 text-white hover:bg-violet-600 disabled:bg-violet-300 disabled:cursor-not-allowed"
                >
                  {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Product" : "Publish Product")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
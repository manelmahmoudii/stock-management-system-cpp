// components/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createProduct, updateProduct, products } = useProducts();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    minThreshold: "5",
    image: "",
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
          image: product.image || "",
        });
        setImagePreview(product.image || null);
      } else if (products.length > 0) {
        alert("Produit introuvable");
        navigate("/ProductsAdmin");
      }
    }
  }, [id, isEditMode, products, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Créer une URL pour la prévisualisation
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      
      // Pour le moment, on stocke le nom du fichier
      // Dans une vraie application, il faudrait uploader vers un serveur
      setFormData({
        ...formData,
        image: `/client/imagesClient/products/${file.name}`
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await updateProduct(id, formData);
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

  return (
    <div className="p-4 pb-20 mx-auto max-w-7xl md:p-6 md:pb-24">
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
                <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="currentColor" strokeWidth="1.2" />
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
              Product Information
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Product Image */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Product Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900/30 dark:file:text-violet-400"
                      />
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Recommended: Square image, PNG or JPG. Place images in /public/images/products/
                      </p>
                    </div>
                  </div>
                </div>

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
                    className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  />
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
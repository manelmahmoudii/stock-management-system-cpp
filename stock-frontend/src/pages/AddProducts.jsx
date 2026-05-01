import React from "react";
import { Link } from "react-router-dom";
const AddProduct = () => {
  return (
    <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-2xl) md:p-6 md:pb-24">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Add Product
        </h2>

        <nav>
          <ol className="flex items-center gap-1.5">
            <Link
  to="/ProductsAdmin"
  className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
>
  Back
  <svg
    className="stroke-current"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</Link>
            <li className="text-sm text-gray-800 dark:text-white/90">
              Add Product
            </li>
          </ol>
        </nav>
      </div>

      <div className="space-y-6">
        {/* Product Description */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Products Description
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            <form>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                
                {/* Product Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Category
                  </label>
                  <select className="h-11 w-full rounded-lg border px-4 py-2.5 bg-transparent border-gray-300 dark:border-gray-700 dark:bg-gray-900">
                    <option>Select a category</option>
                    <option>Laptop</option>
                    <option>Phone</option>
                    <option>Watch</option>
                    <option>Electronics</option>
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Brand
                  </label>
                  <select className="h-11 w-full rounded-lg border px-4 py-2.5 bg-transparent border-gray-300 dark:border-gray-700 dark:bg-gray-900">
                    <option>Select brand</option>
                    <option>Apple</option>
                    <option>Samsung</option>
                    <option>LG</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Color
                  </label>
                  <select className="h-11 w-full rounded-lg border px-4 py-2.5 bg-transparent border-gray-300 dark:border-gray-700 dark:bg-gray-900">
                    <option>Select color</option>
                    <option>Silver</option>
                    <option>Black</option>
                    <option>White</option>
                    <option>Gray</option>
                  </select>
                </div>

                {/* Description */}
                <div className="col-span-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Description
                  </label>
                  <textarea
                    rows="6"
                    placeholder="Receipt Info (optional)"
                    className="w-full rounded-lg border px-4 py-2.5 bg-transparent border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button className="px-5 py-3.5 text-sm rounded-lg border">
            Draft
          </button>
          <button className="px-5 py-3.5 text-sm rounded-lg bg-blue-500 text-white">
            Publish Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
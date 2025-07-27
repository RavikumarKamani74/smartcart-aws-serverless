import React, { useState } from "react";
import productsData from "../data/products";
import { useCart } from "../context/CartContext"; // ✅ Path is correct

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");

  const { addToCart } = useCart(); // ✅ FIXED: use useCart instead of useContext

  const categories = ["All", ...new Set(productsData.map((p) => p.category))];

  const filteredProducts = productsData
    .filter((product) => {
      return (
        (selectedCategory === "All" || product.category === selectedCategory) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">SmartCart Products</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/3"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/4"
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Sort By Price */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/4"
        >
          <option value="none">Sort by Price</option>
          <option value="lowToHigh">Price: Low → High</option>
          <option value="highToLow">Price: High → Low</option>
        </select>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition flex flex-col"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-3 rounded"
            />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-gray-500">{product.category}</p>
            <p className="text-blue-600 font-semibold">${product.price}</p>
            <p className="text-sm mt-2 mb-3">{product.description}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

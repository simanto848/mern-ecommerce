import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="p-8 bg-gray-100">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Welcome to Our E-Commerce Store
        </h1>
        <p className="text-gray-600 text-center">
          Explore our wide range of products including electronics, clothing,
          accessories, and more.
        </p>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products &&
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
        <div className="flex justify-center mt-6">
          <Link to="/products" className="text-blue-500 hover:underline">
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
}

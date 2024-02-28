import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/product?page=${page}`);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts((prevProducts) => [...prevProducts, ...data]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

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
        {products.length % 8 === 0 && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleLoadMore}
              className="text-white hover:underline"
              gradientDuoTone="purpleToPink"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

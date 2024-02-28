import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import ReviewForm from "./ReviewForm";
import ProductReviews from "./ProductReviews"; // Import ProductReviews component

export default function Product() {
  const { currentUser } = useSelector((state) => state.user);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${productId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!currentUser) {
      toast.success("Product added to cart!");
    } else {
      toast.error("Please login to add the product to your cart.");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <img src={product.image} alt={product.name} className="w-full" />
        <div>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-gray-800 font-semibold mb-2">
            Price: ${product.price}
          </p>
          <p className="text-gray-800 font-semibold mb-2">
            Quantity: {product.quantity}
          </p>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {currentUser && (
        <div className="my-8">
          <h2 className="text-xl font-semibold mb-4">Add a Review</h2>
          <ReviewForm productId={productId} />
        </div>
      )}

      <ProductReviews productId={productId} />

      {currentUser && <Toaster />}
    </div>
  );
}

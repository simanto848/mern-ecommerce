import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductReviews = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/review/${productId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, [productId]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Product Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews available for this product.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review._id} className="mb-4">
              <p>
                <strong>User:</strong> {review.userId.username}
              </p>
              <p>
                <strong>Rating:</strong> {review.rating}
              </p>
              <p>
                <strong>Comment:</strong> {review.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductReviews;

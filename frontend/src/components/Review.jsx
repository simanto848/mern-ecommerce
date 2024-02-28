import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

const Review = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { productId } = useParams();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please login to leave a review.");
      return;
    }
    try {
      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, comment, rating }),
      });
      if (!res.ok) {
        throw new Error("Failed to submit review");
      }
      toast.success("Review submitted successfully!");
      setComment("");
      setRating(0);
      // Refetch reviews to update the list
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/delete/${reviewId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete review");
      }
      toast.success("Review deleted successfully!");
      // Refetch reviews to update the list
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-4">Product Reviews</h1>
      {currentUser && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Leave a Review</h2>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-2">
              <label htmlFor="comment" className="block mb-1">
                Your Comment:
              </label>
              <Textarea
                id="comment"
                className="w-full border rounded-md p-2"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="rating" className="block mb-1">
                Rating:
              </label>
              <input
                type="number"
                id="rating"
                className="border rounded-md p-2"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                required
              />
            </div>
            <Button
              type="submit"
              className="text-white px-4 py-2 rounded-md"
              outline
              gradientDuoTone="purpleToPink"
            >
              Submit Review
            </Button>
          </form>
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Product Ratings & Reviews
        </h2>
        {reviews.length === 0 ? (
          <p>No reviews available for this product.</p>
        ) : (
          <ul>
            {reviews.map((review) => (
              <li key={review._id} className="mb-4">
                <div className="flex justify-between">
                  <p>
                    <strong>User:</strong> {review.userId.username}
                  </p>
                  {currentUser && currentUser._id === review.userId._id && (
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
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
      <Toaster />
    </div>
  );
};

export default Review;

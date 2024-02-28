import { Button, TextInput, Textarea } from "flowbite-react";
import React, { useState } from "react";

const ReviewForm = ({ productId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/review/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          comment,
          rating,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to add review");
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="comment">Comment:</label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="rating">Rating:</label>
        <TextInput
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          min="1"
          max="5"
          required
        />
      </div>
      <Button
        type="submit"
        className="mt-2"
        outline
        gradientDuoTone="purpleToPink"
      >
        Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;

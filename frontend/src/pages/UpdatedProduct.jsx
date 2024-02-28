import { useState, useEffect } from "react";
import { Button, TextInput, Textarea, Select } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

export default function UpdateProduct() {
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/product/${productId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category/getAll");
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/product/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      toast.success("Product updated successfully");
      // Handle navigation or any other action upon successful update
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update product");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <Toaster />
      <h1 className="text-center text-3xl my-7 font-semibold">
        Update Product
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Add input fields for product details */}
        <TextInput
          placeholder="Product name"
          id="name"
          value={product.name || ""}
          onChange={handleChange}
        />
        <Select
          id="category"
          value={product.categoryId || ""}
          onChange={handleChange}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Select>
        <TextInput
          placeholder="Product price"
          id="price"
          type="number"
          value={product.price || ""}
          onChange={handleChange}
        />
        <TextInput
          placeholder="Product quantity"
          id="quantity"
          type="number"
          value={product.quantity || ""}
          onChange={handleChange}
        />
        <Textarea
          placeholder="Product description"
          className="h-32 resize-none"
          id="description"
          value={product.description || ""}
          onChange={handleChange}
        />
        {/* Submit button */}
        <Button type="submit" gradientDuoTone="purpleToPink" outline>
          Update Product
        </Button>
      </form>
    </div>
  );
}

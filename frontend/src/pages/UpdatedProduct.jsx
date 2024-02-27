import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UpdatedProduct() {
  const productId = useParams();
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getProduct();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category/getAll");
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProduct = async () => {
    try {
      const res = await fetch(`/api/product/${productId}`);
      const data = res.json();
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  return <div>UpdatedProduct</div>;
}

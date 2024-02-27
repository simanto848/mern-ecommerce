import { Button, FileInput, Select, TextInput, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import "react-circular-progressbar/dist/styles.css";
import toast, { Toaster } from "react-hot-toast";

export default function CreateProduct() {
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);

  useEffect(() => {
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
      console.error(error);
    }
  };

  const handleChange = (e) => {
    if (e.target.id === "category") {
      const selectedCategory = categories.find(
        (category) => category.name === e.target.value
      );
      if (selectedCategory) {
        setProduct({
          ...product,
          categoryId: selectedCategory._id,
          [e.target.id]: e.target.value,
        });
      }
    } else {
      setProduct({ ...product, [e.target.id]: e.target.value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress);
      },
      (error) => {
        setImageUploadError("Could not upload image");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setProduct({ ...product, image: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !product.name ||
        !product.price ||
        !product.quantity ||
        !product.description ||
        !imageFile ||
        !product.categoryId
      ) {
        throw new Error("All fields including image are required");
      }

      if (imageFile) {
        await uploadImage();
      }

      await addProductToDatabase();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addProductToDatabase = async () => {
    try {
      const res = await fetch("/api/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (!res.ok) {
        throw new Error("Failed to add product");
      }
      const responseData = await res.json();
      toast.success("Product added successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <Toaster />
      <h1 className="text-center text-3xl my-7 font-semibold">Add Product</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            placeholder="Product name"
            id="name"
            onChange={handleChange}
          />
          <Select onChange={handleChange} id="category">
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="">
          <TextInput
            placeholder="Product price"
            id="price"
            onChange={handleChange}
          />
        </div>
        <div className="">
          <TextInput
            placeholder="Product quantity"
            id="quantity"
            onChange={handleChange}
          />
        </div>
        <div className="">
          <Textarea
            placeholder="Product description"
            className="h-32 resize-none"
            id="description"
            onChange={handleChange}
          />
        </div>
        <div className="relative">
          <FileInput id="image" accept="image/*" onChange={handleImageChange} />
          {imageFileUrl && (
            <img
              src={imageFileUrl}
              alt="Product"
              className="mt-4 rounded-md max-w-xs mx-auto"
            />
          )}
          {imageUploadProgress > 0 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${imageUploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
        <Button type="submit" gradientDuoTone="purpleToPink" outline>
          Add Product
        </Button>
      </form>
    </div>
  );
}

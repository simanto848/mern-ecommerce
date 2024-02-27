import { useState } from "react";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import OAuth from "../components/OAuth";

export default function Register() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, username, email, mobile, password, confirmPassword } =
      formData;

    if (
      !fullName ||
      !username ||
      !email ||
      !mobile ||
      !password ||
      !confirmPassword
    ) {
      return toast.error("Please fill out all fields.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    // Add mobile number validation if needed

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        navigate("/login");
      } else {
        throw new Error(data.message || "Registration failed.");
      }
    } catch (error) {
      setLoading(false);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              e-commerce
            </span>
          </Link>
          <p className="text-sm mt-5">
            This is my first react full react mern project. You can sign up with
            your email and password or with Google.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Full Name" />
              <TextInput
                type="text"
                placeholder="Full Name"
                id="fullName"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Mobile Number" />
              <TextInput
                type="text"
                placeholder="Mobile Number"
                id="mobile"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Confirm Password" />
              <TextInput
                type="password"
                placeholder="Confirm Password"
                id="confirmPassword"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Register"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/login" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

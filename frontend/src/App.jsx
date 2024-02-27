import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateProduct from "./pages/CreateProduct";
import OnlySellerRoute from "./components/OnlySellerRoute";
import UpdatedProduct from "./pages/UpdatedProduct";

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<OnlySellerRoute />}>
          <Route path="/add-product" element={<CreateProduct />} />
          <Route
            path="/update-product/:productId"
            element={<UpdatedProduct />}
          />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

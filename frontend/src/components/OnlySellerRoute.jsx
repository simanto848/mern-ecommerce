import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function OnlySellerRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.role === "seller" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
}

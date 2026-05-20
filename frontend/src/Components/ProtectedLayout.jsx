import { Navigate } from "react-router-dom";
import { auth } from "../Components/auth";

export default function ProtectedRoute({ children, role }) {
  const user = auth.get();
  const token = auth.getToken();

  if (!user || !token) return <Navigate to="/" replace />;
  if (role && user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}

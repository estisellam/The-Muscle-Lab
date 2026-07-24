import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const userData =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = userData ? JSON.parse(userData) : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
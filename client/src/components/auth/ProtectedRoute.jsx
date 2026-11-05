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
    if (user.role === "Admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/member/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import { getToken, getCurrentUser } from "../../services/authService";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = getToken();
  const user = getCurrentUser();

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

    return <Navigate to={user.role === "Member" ? "/member/dashboard" : "/"} replace />;
  }

  return children;
}

export default ProtectedRoute;
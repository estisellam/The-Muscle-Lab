import { Routes, Route, Navigate } from "react-router-dom";

// layouts
import PublicLayout from "../layouts/PublicLayout";

// public pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import MembershipPlans from "../pages/public/MembershipPlans";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

// member pages
import Dashboard from "../pages/member/Dashboard";
import Profile from "../pages/member/Profile";
import MyMembership from "../pages/member/MyMembership";

// admin pages
import UsersManagement from "../pages/admin/UsersManagement";
import MembershipManagement from "../pages/admin/MembershipManagement";

function AppRoutes() {
  return (
    <Routes>
      {/* public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/membership-plans"
          element={<MembershipPlans />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* member */}
      <Route path="/member/dashboard" element={<Dashboard />} />
      <Route path="/member/profile" element={<Profile />} />
      <Route
        path="/member/membership"
        element={<MyMembership />}
      />

      {/* admin */}
      <Route
        path="/admin/users"
        element={<UsersManagement />}
      />
      <Route
        path="/admin/memberships"
        element={<MembershipManagement />}
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
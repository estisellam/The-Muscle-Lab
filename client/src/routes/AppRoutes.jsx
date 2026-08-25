import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Public Pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import MembershipPlans from "../pages/public/MembershipPlans";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import ForgotPassword from "../pages/public/ForgotPassword";

// Member Pages
import Dashboard from "../pages/member/Dashboard";
import Profile from "../pages/member/Profile";
import MyMembership from "../pages/member/MyMembership";
import CalendarPage from "../pages/member/Calendar";

// Admin Pages
import UsersManagement from "../pages/admin/UsersManagement";
import MembershipManagement from "../pages/admin/MembershipManagement";
import TrainersManagement from "../pages/admin/TrainersManagement";
import ClassesManagement from "../pages/admin/ClassesManagement";
import AdminDashboard from "../pages/admin/AdminDashboard";

//classes page
import Classes from "../pages/Classes/Classes";

function AppRoutes() {
    return (
        <Routes>


            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route
                    path="/membership-plans"
                    element={<MembershipPlans />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />
            </Route>


            <Route
                element={
                    <ProtectedRoute allowedRoles={["Member"]}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/member/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/member/profile"
                    element={<Profile />}
                />

                <Route
                    path="/member/membership"
                    element={<MyMembership />}
                />
                <Route
                    path="/member/classes"
                    element={<Classes />}
                />

                <Route
                    path="/member/calendar"
                    element={<CalendarPage />}
                />
            </Route>


            <Route
                element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/users"
                    element={<UsersManagement />}
                />

                <Route
                    path="/admin/memberships"
                    element={<MembershipManagement />}
                />

                <Route
                    path="/admin/trainers"
                    element={<TrainersManagement />}
                />

                <Route
                    path="/admin/classes"
                    element={<ClassesManagement />}
                />
            </Route>

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

            
        </Routes>

        
    );
}

export default AppRoutes;
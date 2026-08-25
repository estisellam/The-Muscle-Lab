import { NavLink, useNavigate } from "react-router-dom";
import {
    FiHome,
    FiUser,
    FiCreditCard,
    FiUsers,
    FiLogOut,
    FiCalendar,
    FiBarChart2,
} from "react-icons/fi";

import { logout } from "../../services/authService";

import logo from "../../assets/logos/logo.png";

import "./Sidebar.css";

function Sidebar() {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");

    const linkClass = ({ isActive }) =>
        isActive
            ? "sidebar-link active"
            : "sidebar-link";

    function handleLogout() {

        logout();

        navigate("/login");

    }

    return (

        <aside className="sidebar">

            <div className="sidebar-logo">

                <img
                    src={logo}
                    alt="The Muscle Lab"
                    className="sidebar-logo-image"
                />

            </div>

            <nav className="sidebar-nav">
                {user?.role === "Admin" ? (
                    <>
                        <NavLink to="/admin/dashboard" className={linkClass}>
                            <FiBarChart2 />
                            Admin Dashboard
                        </NavLink>
                        <NavLink to="/admin/users" className={linkClass}>
                            <FiUsers />
                            Users
                        </NavLink>
                        <NavLink to="/admin/memberships" className={linkClass}>
                            <FiCreditCard />
                            Memberships
                        </NavLink>
                        <NavLink to="/admin/trainers" className={linkClass}>
                            <FiUsers />
                            Trainers
                        </NavLink>
                        <NavLink to="/admin/classes" className={linkClass}>
                            <FiUsers />
                            Classes
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/member/dashboard" className={linkClass}>
                            <FiHome />
                            Dashboard
                        </NavLink>
                        <NavLink to="/member/profile" className={linkClass}>
                            <FiUser />
                            My Profile
                        </NavLink>
                        <NavLink to="/member/membership" className={linkClass}>
                            <FiCreditCard />
                            Membership
                        </NavLink>
                        <NavLink to="/member/classes" className={linkClass}>
                            <FiUsers />
                            Classes
                        </NavLink>
                        <NavLink to="/member/calendar" className={linkClass}>
                            <FiCalendar />
                            Calendar
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">

                <button
                    type="button"
                    className="sidebar-link logout"
                    onClick={handleLogout}
                >
                    <FiLogOut />
                    Logout
                </button>

            </div>

        </aside>

    );

}

export default Sidebar;
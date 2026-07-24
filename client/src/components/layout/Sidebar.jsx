import { NavLink, useNavigate } from "react-router-dom";
import {
    FiHome,
    FiUser,
    FiCreditCard,
    FiLogOut,
} from "react-icons/fi";

import { logout } from "../../services/authService";

import logo from "../../assets/logos/logo.png";

import "./Sidebar.css";

function Sidebar() {

    const navigate = useNavigate();


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

                <NavLink
                    to="/member/dashboard"
                    className={linkClass}
                >
                    <FiHome />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/member/profile"
                    className={linkClass}
                >
                    <FiUser />
                    My Profile
                </NavLink>

                <NavLink
                    to="/member/membership"
                    className={linkClass}
                >
                    <FiCreditCard />
                    Membership
                </NavLink>

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
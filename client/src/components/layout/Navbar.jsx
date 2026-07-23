import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

import logo from "../../assets/logos/logo.png";

import "./Navbar.css";

function Navbar() {
  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link
          to="/"
          aria-label="The Muscle Lab home"
          className="navbar-logo"
        >
          <img src={logo} alt="The Muscle Lab" />
        </Link>

        <nav className="navbar-nav">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/membership-plans" className={navLinkClass}>
            Memberships
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="login-button">
            Login
          </Link>

          <Link to="/register" className="register-button">
            Sign Up
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open navigation menu"
          className="menu-button"
        >
          <Menu size={23} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
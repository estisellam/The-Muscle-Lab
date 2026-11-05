import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

import logo from "../../assets/logos/logo.png";

import "./Navbar.css";
import Button from "../ui/Button";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <header className={`navbar ${menuOpen ? "menu-open" : ""}`}>
      <div className="container navbar-container">
        <Link 
          to="/"
          aria-label="The Muscle Lab home"
          className="navbar-logo"
        >
          <img src={logo} alt="The Muscle Lab" />
        </Link>

        <nav id="public-navigation" className="navbar-nav" onClick={() => setMenuOpen(false)}>
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
          <Button
              to="/login"
              variant="secondary">
              Login
          </Button>

          <Button to="/register">
              Sign Up
          </Button>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="public-navigation"
          onClick={() => setMenuOpen(open => !open)}
          className="menu-button"
        >
          <Menu size={23} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
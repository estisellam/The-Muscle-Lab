import "./PublicLayout.css";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function PublicLayout() {
  return (
    <div className="public-layout">
      <Navbar />

      <main className="public-layout-main">
        <Outlet />
      </main>

    </div>
  );
}

export default PublicLayout;
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";

import { useUser } from "../context/UserContext";

import "./DashboardLayout.css";

function DashboardLayout() {

    const { user } = useUser();

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-content">

                <TopBar
                    name={
                        user
                            ? `${user.first_name} ${user.last_name}`
                            : "Member"
                    }
                    role={user?.role}
                    image={user?.profile_image}
                />

                <main className="dashboard-main">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}

export default DashboardLayout;
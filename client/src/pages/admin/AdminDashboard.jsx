import { useEffect, useMemo, useState } from "react";
import { BarChart3, Users, CalendarDays, CreditCard, TrendingUp, Sparkles } from "lucide-react";
import apiRequest from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [stats, setStats] = useState({
        memberCount: 0,
        activeMembershipCount: 0,
        classCount: 0,
        registrationCount: 0,
        avgAttendance: 0,
        memberGrowth: 0,
        renewalRate: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await apiRequest("/dashboard/admin-overview");
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    const cards = useMemo(() => [
        { title: "Members", value: stats.memberCount, icon: Users },
        { title: "Active memberships", value: stats.activeMembershipCount, icon: CreditCard },
        { title: "Scheduled classes", value: stats.classCount, icon: CalendarDays },
        { title: "Live registrations", value: stats.registrationCount, icon: TrendingUp }
    ], [stats]);

    if (loading) {
        return <div className="admin-dashboard-loading">Loading admin insights...</div>;
    }

    return (
        <div className="admin-dashboard-page">
            <div className="admin-dashboard-header">
                <div>
                    <p className="admin-dashboard-eyebrow">Operations center</p>
                    <h1>Admin intelligence dashboard</h1>
                </div>
                <div className="admin-dashboard-chip">Live overview</div>
            </div>

            <div className="admin-dashboard-grid">
                {cards.map(({ title, value, icon: Icon }) => (
                    <div key={title} className="admin-stat-card">
                        <div className="admin-stat-icon">
                            <Icon size={18} />
                        </div>
                        <div>
                            <h3>{title}</h3>
                            <p>{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-dashboard-panel">
                <div className="admin-dashboard-panel-header">
                    <BarChart3 size={18} />
                    <h2>Performance snapshot</h2>
                </div>
                <p>Track demand, retention and participation in real time from the admin view.</p>
                <div className="admin-dashboard-bars">
                    <div className="admin-bar-item">
                        <label>Member growth</label>
                        <div className="admin-bar-track"><div style={{ width: `${stats.memberGrowth}%` }} /></div>
                    </div>
                    <div className="admin-bar-item">
                        <label>Attendance rate</label>
                        <div className="admin-bar-track"><div style={{ width: `${stats.avgAttendance}%` }} /></div>
                    </div>
                    <div className="admin-bar-item">
                        <label>Membership renewals</label>
                        <div className="admin-bar-track"><div style={{ width: `${stats.renewalRate}%` }} /></div>
                    </div>
                </div>
            </div>

            <div className="admin-dashboard-activity">
                <div className="admin-dashboard-activity-header">
                    <div className="admin-dashboard-activity-title">
                        <Sparkles size={16} />
                        <h3>Recent activity</h3>
                    </div>
                    <span>Updated live</span>
                </div>
                <ul>
                    {stats.recentActivity.map((item, index) => (
                        <li key={`${item.type}-${index}`}>
                            <strong>{item.label}</strong>
                            <span>{item.detail}</span>
                            <small>{item.occurred_at}</small>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminDashboard;

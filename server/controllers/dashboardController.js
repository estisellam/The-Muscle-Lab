import pool from "../config/db.js";

export async function getAdminDashboardOverview(req, res) {
    try {
        const [usersResult] = await pool.execute(
            `SELECT COUNT(*) AS count FROM Users`
        );

        const [activeMembershipsResult] = await pool.execute(
            `SELECT COUNT(*) AS count FROM UserMemberships WHERE status = 'Active'`
        );

        const [classesResult] = await pool.execute(
            `SELECT COUNT(*) AS count FROM Classes`
        );

        const [registrationsResult] = await pool.execute(
            `SELECT COUNT(*) AS count FROM ClassRegistrations WHERE status = 'Registered'`
        );

        const [attendanceResult] = await pool.execute(
            `
            SELECT AVG(CASE WHEN a.attended = TRUE THEN 1 ELSE 0 END) AS avg_attendance
            FROM Attendance a
            INNER JOIN ClassRegistrations cr ON cr.id = a.class_registration_id
            WHERE cr.status = 'Registered'
            `
        );

        const [recentClassRows] = await pool.execute(
            `
            SELECT
                'class' AS type,
                title AS label,
                CONCAT(room, ' • ', DATE_FORMAT(class_date, '%b %d')) AS detail,
                class_date AS occurred_at
            FROM Classes
            ORDER BY class_date DESC, start_time DESC
            LIMIT 4
            `
        );

        const [recentRegistrationRows] = await pool.execute(
            `
            SELECT
                'registration' AS type,
                CONCAT(u.first_name, ' ', u.last_name) AS label,
                c.title AS detail,
                cr.registration_date AS occurred_at
            FROM ClassRegistrations cr
            INNER JOIN Users u ON u.id = cr.user_id
            INNER JOIN Classes c ON c.id = cr.class_id
            WHERE cr.status = 'Registered'
            ORDER BY cr.registration_date DESC
            LIMIT 4
            `
        );

        const recentActivity = [...recentClassRows, ...recentRegistrationRows]
            .sort((a, b) => new Date(b.occurred_at) - new Date(a.occurred_at))
            .slice(0, 6)
            .map((item) => ({
                ...item,
                occurred_at: new Date(item.occurred_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                })
            }));

        const memberCount = Number(usersResult[0]?.count || 0);
        const activeMembershipCount = Number(activeMembershipsResult[0]?.count || 0);
        const classCount = Number(classesResult[0]?.count || 0);
        const registrationCount = Number(registrationsResult[0]?.count || 0);
        const avgAttendance = Number(attendanceResult[0]?.avg_attendance || 0) * 100;

        res.status(200).json({
            memberCount,
            activeMembershipCount,
            classCount,
            registrationCount,
            avgAttendance: Math.round(avgAttendance),
            memberGrowth: Math.min(100, Math.round((memberCount / 40) * 100)),
            renewalRate: Math.min(100, Math.round((activeMembershipCount / Math.max(memberCount, 1)) * 100)),
            recentActivity
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

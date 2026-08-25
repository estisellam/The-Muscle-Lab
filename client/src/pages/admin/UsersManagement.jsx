import { useEffect, useState } from "react";
import apiRequest from "../../services/api";
import "./UsersManagement.css";

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await apiRequest("/users");
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <div className="users-management-page">
      <div className="users-management-panel">
        <h1 className="users-management-title">Users Management</h1>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="users-management-list">
            {users.map((user) => (
              <div key={user.id} className="users-management-card">
                <h3>{user.first_name} {user.last_name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Phone:</strong> {user.phone || "-"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersManagement;
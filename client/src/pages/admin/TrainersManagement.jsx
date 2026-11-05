import { useEffect, useState } from "react";
import apiRequest from "../../services/api";
import "./UsersManagement.css";

function TrainersManagement() {
    const [trainers, setTrainers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadError, setLoadError] = useState("");
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        user_id: "",
        specialization: "",
        experience_years: "",
        biography: ""
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadTrainers();
    }, []);

    async function loadTrainers() {
        setLoading(true);
        setLoadError("");
        try {
            const [trainerData, userData] = await Promise.all([
                apiRequest("/trainers"),
                apiRequest("/users")
            ]);
            setTrainers(trainerData);
            setUsers(userData);
        } catch (error) {
            setLoadError(error.message || "Unable to load trainers and users. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            if (editingId) {
                await apiRequest(`/trainers/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        specialization: form.specialization,
                        experience_years: Number(form.experience_years),
                        biography: form.biography
                    })
                });
            } else {
                await apiRequest("/trainers", {
                    method: "POST",
                    body: JSON.stringify({
                        user_id: form.user_id,
                        specialization: form.specialization,
                        experience_years: Number(form.experience_years),
                        biography: form.biography
                    })
                });
            }

            setForm({ user_id: "", specialization: "", experience_years: "", biography: "" });
            setEditingId(null);
            loadTrainers();
        } catch (error) {
            alert(error.message || "Failed to save trainer");
        }
    }

    function handleEdit(trainer) {
        setEditingId(trainer.id);
        setForm({
            user_id: trainer.user_id,
            specialization: trainer.specialization || "",
            experience_years: trainer.experience_years || "",
            biography: trainer.biography || ""
        });
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this trainer?")) return;

        try {
            await apiRequest(`/trainers/${id}`, { method: "DELETE" });
            loadTrainers();
        } catch (error) {
            alert(error.message || "Failed to delete trainer");
        }
    }

    const availableUsers = users.filter(user =>
        user.id === form.user_id || !trainers.some(trainer => trainer.user_id === user.id)
    );

    return (
        <div className="users-management-page">
            <div className="users-management-panel">
                <h1 className="users-management-title">Trainers Management</h1>

                <form onSubmit={handleSubmit} className="users-management-form">
                    <div className="admin-select-field">
                        <label htmlFor="trainer-user-select">User</label>
                        <select
                            id="trainer-user-select"
                            name="user_id"
                            value={form.user_id}
                            onChange={handleChange}
                            disabled={loading || Boolean(editingId)}
                            required
                        >
                            <option value="">Select a user</option>
                            {availableUsers.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name} — {user.email}
                                </option>
                            ))}
                        </select>
                        {editingId && <small>The linked user cannot be changed.</small>}
                    </div>
                    <input
                        name="specialization"
                        value={form.specialization}
                        onChange={handleChange}
                        placeholder="Specialization"
                    />
                    <input
                        name="experience_years"
                        type="number"
                        value={form.experience_years}
                        onChange={handleChange}
                        placeholder="Experience Years"
                    />
                    <textarea
                        name="biography"
                        value={form.biography}
                        onChange={handleChange}
                        placeholder="Biography"
                    />
                    <button type="submit" disabled={loading || Boolean(loadError) || (!editingId && availableUsers.length === 0)}>{editingId ? "Save Changes" : "Add Trainer"}</button>
                    {editingId ? (
                        <button type="button" onClick={() => {
                            setEditingId(null);
                            setForm({ user_id: "", specialization: "", experience_years: "", biography: "" });
                        }}>
                            Cancel
                        </button>
                    ) : null}
                </form>

                {loadError && (
                    <div role="alert" className="admin-load-error">
                        <p>{loadError}</p>
                        <button type="button" onClick={loadTrainers}>Retry</button>
                    </div>
                )}
                {!loading && !loadError && !editingId && availableUsers.length === 0 && (
                    <p>No users are available. Register a user first, or edit an existing trainer.</p>
                )}

                {loading ? (
                    <p>Loading trainers...</p>
                ) : (
                    <div className="users-management-list">
                        {trainers.map((trainer) => (
                            <div key={trainer.id} className="users-management-card">
                                <h3>
                                    {trainer.first_name} {trainer.last_name}
                                </h3>
                                <p><strong>Email:</strong> {trainer.email}</p>
                                <p><strong>Specialization:</strong> {trainer.specialization || "-"}</p>
                                <p><strong>Experience:</strong> {trainer.experience_years || 0} years</p>
                                <p><strong>Phone:</strong> {trainer.phone || "-"}</p>
                                <div className="users-management-actions">
                                    <button onClick={() => handleEdit(trainer)}>Edit</button>
                                    <button onClick={() => handleDelete(trainer.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrainersManagement;

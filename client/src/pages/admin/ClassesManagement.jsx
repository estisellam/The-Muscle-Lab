import { useEffect, useState } from "react";
import apiRequest from "../../services/api";
import "./UsersManagement.css";

function ClassesManagement() {
    const [classes, setClasses] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loadError, setLoadError] = useState("");
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        trainer_id: "",
        title: "",
        description: "",
        class_date: "",
        start_time: "",
        end_time: "",
        room: "",
        capacity: ""
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadClasses();
    }, []);

    async function loadClasses() {
        setLoading(true);
        setLoadError("");
        try {
            const [classData, trainerData] = await Promise.all([
                apiRequest("/classes/admin"),
                apiRequest("/trainers")
            ]);
            setClasses(classData);
            setTrainers(trainerData);
        } catch (error) {
            setLoadError(error.message || "Unable to load classes and trainers. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (editingId) {
                await apiRequest(`/classes/admin/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        ...form,
                        capacity: Number(form.capacity)
                    })
                });
            } else {
                await apiRequest(`/classes/admin`, {
                    method: "POST",
                    body: JSON.stringify({
                        ...form,
                        capacity: Number(form.capacity)
                    })
                });
            }

            setForm({ trainer_id: "", title: "", description: "", class_date: "", start_time: "", end_time: "", room: "", capacity: "" });
            setEditingId(null);
            loadClasses();
        } catch (error) {
            alert(error.message || "Failed to save class");
        }
    }

    function handleEdit(cls) {
        setEditingId(cls.id);
        setForm({
            trainer_id: cls.trainer_id,
            title: cls.title,
            description: cls.description || "",
            class_date: cls.class_date,
            start_time: cls.start_time,
            end_time: cls.end_time,
            room: cls.room || "",
            capacity: cls.capacity || 0
        });
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this class?")) return;

        try {
            await apiRequest(`/classes/admin/${id}`, { method: "DELETE" });
            loadClasses();
        } catch (error) {
            alert(error.message || "Failed to delete class");
        }
    }

    return (
        <div className="users-management-page">
            <div className="users-management-panel">
                <h1 className="users-management-title">Classes Management</h1>

                <form onSubmit={handleSubmit} className="users-management-form">
                    <div className="admin-select-field">
                        <label htmlFor="class-trainer-select">Trainer</label>
                        <select id="class-trainer-select" name="trainer_id" value={form.trainer_id} onChange={handleChange} disabled={loading} required>
                            <option value="">Select a trainer</option>
                            {trainers.map(trainer => (
                                <option key={trainer.id} value={trainer.id}>
                                    {trainer.first_name} {trainer.last_name}{trainer.specialization ? ` — ${trainer.specialization}` : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
                    <input name="class_date" value={form.class_date} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" required />
                    <input name="start_time" value={form.start_time} onChange={handleChange} placeholder="Start Time (HH:MM)" required />
                    <input name="end_time" value={form.end_time} onChange={handleChange} placeholder="End Time (HH:MM)" required />
                    <input name="room" value={form.room} onChange={handleChange} placeholder="Room" />
                    <input name="capacity" type="number" value={form.capacity} onChange={handleChange} placeholder="Capacity" />
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
                    <button type="submit" disabled={loading || Boolean(loadError) || trainers.length === 0}>{editingId ? "Save Changes" : "Add Class"}</button>
                    {editingId ? (
                        <button type="button" onClick={() => { setEditingId(null); setForm({ trainer_id: "", title: "", description: "", class_date: "", start_time: "", end_time: "", room: "", capacity: "" }); }}>Cancel</button>
                    ) : null}
                </form>

                {loadError && (
                    <div role="alert" className="admin-load-error">
                        <p>{loadError}</p>
                        <button type="button" onClick={loadClasses}>Retry</button>
                    </div>
                )}
                {!loading && !loadError && trainers.length === 0 && <p>Add a trainer before creating a class.</p>}

                {loading ? (
                    <p>Loading classes...</p>
                ) : (
                    <div className="users-management-list">
                        {classes.map((cls) => (
                            <div key={cls.id} className="users-management-card">
                                <h3>{cls.title}</h3>
                                <p><strong>Trainer:</strong> {cls.trainer_name}</p>
                                <p><strong>Date:</strong> {cls.class_date} {cls.start_time} - {cls.end_time}</p>
                                <p><strong>Room:</strong> {cls.room}</p>
                                <p><strong>Capacity:</strong> {cls.capacity}</p>
                                <div className="users-management-actions">
                                    <button onClick={() => handleEdit(cls)}>Edit</button>
                                    <button onClick={() => handleDelete(cls.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClassesManagement;

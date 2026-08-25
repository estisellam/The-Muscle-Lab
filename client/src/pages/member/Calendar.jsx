import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { getClassDateCounts, getClassesByDate } from "../../services/api";
import "./Calendar.css";

function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatDayLabel(date) {
    return new Date(date).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short"
    });
}

function CalendarPage() {
    const [dateCounts, setDateCounts] = useState({});
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedLoading, setSelectedLoading] = useState(false);

    useEffect(() => {
        async function loadMonthCounts() {
            try {
                const year = viewDate.getFullYear();
                const month = viewDate.getMonth();
                const start = toDateKey(new Date(year, month, 1));
                const end = toDateKey(new Date(year, month + 1, 0));

                const data = await getClassDateCounts(start, end);

                const map = {};
                data.forEach((row) => {
                    map[row.class_date] = row.count;
                });

                setDateCounts(map);
            } catch (error) {
                console.error(error);
            }
        }

        loadMonthCounts();
    }, [viewDate]);

    useEffect(() => {
        async function loadSelectedDay() {
            setSelectedLoading(true);

            try {
                const data = await getClassesByDate(selectedDate);
                setSelectedClasses(data);
            } catch (error) {
                console.error(error);
                setSelectedClasses([]);
            } finally {
                setSelectedLoading(false);
            }
        }

        loadSelectedDay();
    }, [selectedDate]);

    const daysInMonth = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        for (let index = 0; index < firstDay.getDay(); index += 1) {
            days.push(null);
        }

        for (let day = 1; day <= lastDay.getDate(); day += 1) {
            days.push(new Date(year, month, day));
        }

        return days;
    }, [viewDate]);

    function changeMonth(delta) {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));
    }

    return (
        <div className="calendar-page">
            <div className="calendar-header">
                <div>
                    <p className="calendar-eyebrow">Interactive calendar</p>
                    <h1>Class schedule planner</h1>
                </div>
                <div className="calendar-nav">
                    <button type="button" onClick={() => changeMonth(-1)}>
                        <ArrowLeft size={16} />
                    </button>
                    <strong>
                        {viewDate.toLocaleDateString("en-GB", {
                            month: "long",
                            year: "numeric"
                        })}
                    </strong>
                    <button type="button" onClick={() => changeMonth(1)}>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            <div className="calendar-grid-wrapper">
                <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="calendar-weekday">{day}</div>
                    ))}

                    {daysInMonth.map((day, index) => {
                        if (!day) {
                            return <div key={`empty-${index}`} className="calendar-day empty" />;
                        }

                        const key = toDateKey(day);
                        const count = dateCounts[key] || 0;
                        const isSelected = key === selectedDate;

                        return (
                            <button
                                key={key}
                                type="button"
                                className={`calendar-day ${isSelected ? "selected" : ""}`}
                                onClick={() => setSelectedDate(key)}
                            >
                                <span>{day.getDate()}</span>
                                {count > 0 && <small>{count} class{count > 1 ? "es" : ""}</small>}
                            </button>
                        );
                    })}
                </div>

                <div className="calendar-side-panel">
                    <div className="calendar-side-title">
                        <CalendarDays size={18} />
                        <h2>{formatDayLabel(selectedDate)}</h2>
                    </div>

                    {selectedLoading ? (
                        <p className="calendar-empty">Loading...</p>
                    ) : selectedClasses.length > 0 ? (
                        selectedClasses.map((gymClass) => (
                            <div key={gymClass.id} className="calendar-class-card">
                                <h3>{gymClass.title}</h3>
                                <p>{gymClass.trainer_name}</p>
                                <span>{gymClass.start_time} - {gymClass.end_time}</span>
                                <small>{gymClass.room}</small>
                            </div>
                        ))
                    ) : (
                        <p className="calendar-empty">No classes scheduled for this day yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;

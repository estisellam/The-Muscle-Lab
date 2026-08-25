import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, CalendarDays } from "lucide-react";
import { getCoachInsight } from "../../services/aiService";
import "./AICoach.css";

function AICoach({ user, membership, myClasses = [], availableClasses = [] }) {
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadInsight() {
            setLoading(true);
            const result = await getCoachInsight({
                user,
                membership,
                myClasses,
                availableClasses
            });

            if (isMounted) {
                setInsight(result);
                setLoading(false);
            }
        }

        loadInsight();

        return () => {
            isMounted = false;
        };
    }, [user, membership, myClasses, availableClasses]);

    return (
        <div className="ai-coach-card">
            <div className="ai-coach-header">
                <div className="ai-coach-title-group">
                    <Sparkles size={20} />
                    <h3>AI Coach</h3>
                </div>
                <span className="ai-chip">Smart recommendation</span>
            </div>

            {loading ? (
                <p className="ai-loading">Generating your next best move...</p>
            ) : (
                <>
                    <p className="ai-summary">{insight?.summary}</p>

                    <div className="ai-suggestion-box">
                        <div className="ai-suggestion-top">
                            <TrendingUp size={18} />
                            <strong>{insight?.suggestion?.title}</strong>
                        </div>
                        <p>{insight?.suggestion?.subtitle}</p>
                        <span>{insight?.suggestion?.detail}</span>
                    </div>

                    <div className="ai-reasons">
                        {insight?.reasons?.map((reason, index) => (
                            <div key={index} className="ai-reason-item">
                                <CalendarDays size={16} />
                                <span>{reason}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default AICoach;

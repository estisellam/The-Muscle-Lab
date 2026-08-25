const DEFAULT_AI_URL = import.meta.env.VITE_AI_API_URL;

function buildLocalInsight({ user, membership, myClasses = [], availableClasses = [] }) {
    const firstName = user?.first_name || user?.firstName || "there";
    const hasMembership = Boolean(membership?.name);
    const registeredCount = myClasses.length;

    const nextBestClass = availableClasses[0] || myClasses[0] || null;

    const reasons = [];

    if (!hasMembership) {
        reasons.push("You do not have an active membership yet, so a membership plan would be a strong next step.");
    } else {
        reasons.push(`Your current membership is ${membership.name}, so you can focus on classes that complement it.`);
    }

    if (registeredCount === 0) {
        reasons.push("You have not joined any classes yet, so a first class recommendation will help you get started.");
    } else {
        reasons.push(`You already joined ${registeredCount} class${registeredCount === 1 ? "" : "es"}, so a follow-up session would be a great fit.`);
    }

    if (nextBestClass) {
        reasons.push(`The best next match right now is ${nextBestClass.title || "a featured class"}.`);
    }

    const summary = hasMembership
        ? `Hi ${firstName}, your plan looks ready for a focused workout. I recommend picking a class that builds on your current momentum.`
        : `Hi ${firstName}, your fitness journey is just getting started. A membership plus one class this week would be a great next move.`;

    return {
        title: "AI Coach Recommendation",
        summary,
        reasons,
        suggestion: nextBestClass
            ? {
                title: nextBestClass.title,
                subtitle: nextBestClass.trainer_name || "Featured class",
                detail: nextBestClass.room || "Check the schedule"
            }
            : {
                title: "Explore the class schedule",
                subtitle: "Pick a session that fits your week",
                detail: "You can always discover new sessions from the classes page"
            }
    };
}

export async function getCoachInsight(payload) {
    if (DEFAULT_AI_URL) {
        try {
            const response = await fetch(`${DEFAULT_AI_URL}/coach`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                if (data?.suggestion) {
                    return data;
                }
            }
        } catch (error) {
            console.warn("AI API unavailable, falling back to local coaching engine.", error);
        }
    }

    return buildLocalInsight(payload);
}

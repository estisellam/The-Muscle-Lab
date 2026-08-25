import { useEffect, useState } from "react";
import apiRequest from "../../services/api";
import "./MembershipManagement.css";

function MembershipManagement() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await apiRequest("/membership-plans");
        setPlans(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  return (
    <div className="membership-management">
      <div className="membership-panel">
        <h1 className="membership-title">Membership Management</h1>
        {loading ? (
          <p>Loading membership plans...</p>
        ) : (
          <div className="membership-list">
            {plans.map((plan) => (
              <div key={plan.id} className="membership-card">
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <p><strong>Duration:</strong> {plan.duration_months} months</p>
                <p><strong>Price:</strong> ${plan.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MembershipManagement;
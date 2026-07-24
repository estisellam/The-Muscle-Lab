import "./AuthLayout.css";
import jim from "../../assets/images/jim.png";
const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className="auth-page">

            <div className="auth-left">

                <div className="auth-content">

                    <span className="auth-badge">
                        THE MUSCLE LAB
                    </span>

                    <h1>{title}</h1>

                    <p>{subtitle}</p>

                    <div className="auth-card">
                        {children}
                    </div>

                </div>

            </div>

            <div className="auth-right">
                <img src={jim} alt="Gim" className="auth-image"/>
            </div>

        </div>
    );
};

export default AuthLayout;
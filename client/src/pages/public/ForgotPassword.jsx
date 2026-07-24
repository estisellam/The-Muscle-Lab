import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Password reset requested for:", email);
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to reset your password."
    >
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Send Reset Link
        </button>

        <p className="register-link">
          Remember your password?
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;
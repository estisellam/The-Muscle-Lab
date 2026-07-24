import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/ui/Input";

import { register } from "../../services/authService";

import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    }

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");

        if (formData.password !== formData.confirmPassword) {

            setError("Passwords do not match.");
            return;

        }

        try {

            setLoading(true);

            await register({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
            });

            navigate("/login");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Registration failed."
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <AuthLayout
            title="Create Account"
            subtitle="Join The Muscle Lab and start your fitness journey."
        >

            <form
                className="register-form"
                onSubmit={handleSubmit}
            >

                {error && (
                    <div className="register-error">
                        {error}
                    </div>
                )}

                <Input
                    label="First Name"
                    type="text"
                    name="first_name"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Last Name"
                    type="text"
                    name="last_name"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <button
                    type="submit"
                    className="register-button"
                    disabled={loading}
                >
                    {loading
                        ? "Creating Account..."
                        : "Create Account"}
                </button>

                <p className="login-link">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </form>

        </AuthLayout>

    );

}

export default Register;
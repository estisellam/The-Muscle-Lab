import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/ui/Input";

import {
    login,
    saveLogin
} from "../../services/authService";

import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [rememberMe, setRememberMe] = useState(false);
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

        setLoading(true);
        setError("");

        try {

            const { token, user } =
                await login(formData);

            saveLogin(
                token,
                user,
                rememberMe
            );

            if (user.role === "Admin") {

                navigate("/admin/dashboard");

            } else {

                navigate("/member/dashboard");

            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to continue your fitness journey."
        >

            <form
                className="login-form"
                onSubmit={handleSubmit}
            >

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

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

                <div className="login-options">

                    <label className="remember-me">

                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() =>
                                setRememberMe((prev) => !prev)
                            }
                        />

                        Remember me

                    </label>

                    <Link to="/forgot-password">
                        Forgot Password?
                    </Link>

                </div>

                <button
                    className="login-button"
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Signing In..."
                        : "Login"}
                </button>

                <p className="register-link">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create one
                    </Link>

                </p>

            </form>

        </AuthLayout>

    );

}

export default Login;
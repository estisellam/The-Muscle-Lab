import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Input.css";

function Input({
    label,
    type = "text",
    error,
    className = "",
    ...props
}) {

    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
        <div className="input-group">

            {label && (
                <label className="input-label">
                    {label}
                </label>
            )}

            <div className="input-wrapper">

                <input
                    {...props}
                    type={isPassword && showPassword ? "text" : type}
                    className={`input-field ${isPassword ? "password-input" : ""} ${className}`}
                />

                {isPassword && (
                    <button
                        type="button"
                        className="show-password-btn"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                )}

            </div>

            {error && (
                <span className="input-error">
                    {error}
                </span>
            )}

        </div>
    );
}

export default Input;
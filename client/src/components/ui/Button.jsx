import { Link } from "react-router-dom";
import "./Button.css";

function Button({
  children,
  to,
  type = "button",
  variant = "primary",
  className = "",
  onClick,
}) {
  const buttonClass = `button button-${variant} ${className}`;

  if (to) {
    return (
      <Link to={to} className={buttonClass}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
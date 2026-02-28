interface ButtonProps {
    label: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
    fullWidth?: boolean;
    disabled?: boolean;
}

const Button = ({
    label,
    onClick,
    type = "button",
    variant = "primary",
    fullWidth = false,
    disabled = false,
}: ButtonProps) => {
    const base = "px-4 py-3 rounded-2xl text-sm font-semibold transition-all";
    const full = fullWidth ? "w-full" : "";
    const disabled_style = disabled ? "opacity-40 cursor-not-allowed" : "hover:shadow-lg";

    const variants = {
        primary: "text-white",
        secondary: "border border-rose-200 text-rose-500 hover:bg-rose-50",
        danger: "border border-gray-200 text-gray-400 hover:bg-gray-50",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${full} ${variants[variant]} ${disabled_style}`}
            style={variant === "primary" ? {
                background: "linear-gradient(135deg, #f43f5e, #a855f7)"
            } : {}}
        >
            {label}
        </button>
    );
};

export default Button;
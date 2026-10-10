import type { LucideIcon } from "lucide-react";

interface ButtonProps {
    label: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "md" | "sm";
    fullWidth?: boolean;
    disabled?: boolean;
    icon?: LucideIcon;
    iconRight?: LucideIcon;
}

const variants = {
    primary: "bg-baya-600 text-white hover:bg-baya-700 shadow-sm shadow-baya-900/10",
    secondary: "bg-white border border-linea text-tinta hover:bg-crema",
    danger: "bg-white border border-linea text-red-700 hover:bg-red-50",
    ghost: "text-baya-600 hover:bg-baya-50",
};

const sizes = {
    md: "h-11 px-4 text-sm rounded-xl gap-2",
    sm: "h-9 px-3 text-xs rounded-[10px] gap-1.5",
};

const Button = ({
    label,
    onClick,
    type = "button",
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    icon: Icon,
    iconRight: IconRight,
}: ButtonProps) => {
    const iconSize = size === "sm" ? 15 : 17;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center font-semibold whitespace-nowrap transition-all
                active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
        >
            {Icon && <Icon size={iconSize} strokeWidth={2} />}
            {label}
            {IconRight && <IconRight size={iconSize} strokeWidth={2} />}
        </button>
    );
};

export default Button;

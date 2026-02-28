interface BadgeProps {
    label: string;
    variant?: "programada" | "finalizada" | "cancelada" | "default";
}

const Badge = ({ label, variant = "default" }: BadgeProps) => {
    const variants = {
        programada: "bg-rose-100 text-rose-600",
        finalizada: "bg-emerald-100 text-emerald-600",
        cancelada: "bg-gray-100 text-gray-400",
        default: "bg-violet-100 text-violet-600",
    };

    return (
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${variants[variant]}`}>
            {label}
        </span>
    );
};

export default Badge;
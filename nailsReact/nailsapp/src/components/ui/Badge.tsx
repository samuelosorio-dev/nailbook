import { Check, X } from "lucide-react";

interface BadgeProps {
    label: string;
    variant?: "programada" | "finalizada" | "cancelada" | "default";
}

const variants = {
    programada: "bg-baya-100 text-baya-700",
    finalizada: "bg-salvia-50 text-salvia-700",
    cancelada: "bg-[#EFEAEC] text-[#5F5258]",
    default: "bg-crema text-suave",
};

const Badge = ({ label, variant = "default" }: BadgeProps) => {
    return (
        <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${variants[variant]}`}
        >
            {variant === "finalizada" && <Check size={12} strokeWidth={2.5} />}
            {variant === "cancelada" && <X size={12} strokeWidth={2.5} />}
            {label}
        </span>
    );
};

export default Badge;

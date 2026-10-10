import type { LucideIcon } from "lucide-react";

interface IconButtonProps {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: "outline" | "soft" | "ghost";
    size?: "md" | "sm";
}

const variants = {
    outline: "bg-white border border-linea text-tinta hover:bg-crema",
    soft: "bg-crema text-tinta hover:bg-baya-50",
    ghost: "text-suave hover:bg-crema hover:text-tinta",
};

const IconButton = ({
    icon: Icon,
    label,
    onClick,
    href,
    variant = "outline",
    size = "md",
}: IconButtonProps) => {
    const clases = `inline-grid place-items-center flex-shrink-0 transition-all active:scale-95
        ${size === "md" ? "w-11 h-11 rounded-xl" : "w-9 h-9 rounded-[10px]"} ${variants[variant]}`;
    const iconSize = size === "md" ? 20 : 16;

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className={clases}
                onClick={(e) => e.stopPropagation()}
            >
                <Icon size={iconSize} strokeWidth={1.8} />
            </a>
        );
    }

    return (
        <button type="button" aria-label={label} title={label} onClick={onClick} className={clases}>
            <Icon size={iconSize} strokeWidth={1.8} />
        </button>
    );
};

export default IconButton;

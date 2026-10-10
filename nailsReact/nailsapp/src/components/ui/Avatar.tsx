import { iniciales } from "../../utils/formato";

interface AvatarProps {
    nombre: string;
    semilla?: number;
    tamano?: "sm" | "md" | "lg";
}

// Tonos suaves variados para que no todas las clientas se vean iguales
const PALETA = [
    "bg-baya-100 text-baya-800",
    "bg-[#EFE6F3] text-[#4E2A5E]",
    "bg-[#F6EADF] text-[#6B3D1F]",
    "bg-[#E6EEF0] text-[#244550]",
    "bg-salvia-50 text-salvia-700",
];

const tamanos = {
    sm: "w-9 h-9 rounded-[10px] text-xs",
    md: "w-11 h-11 rounded-xl text-sm",
    lg: "w-14 h-14 rounded-2xl text-base",
};

const Avatar = ({ nombre, semilla, tamano = "md" }: AvatarProps) => {
    const base = semilla ?? [...nombre].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const color = PALETA[Math.abs(base) % PALETA.length];

    return (
        <div
            aria-hidden="true"
            className={`grid place-items-center font-bold flex-shrink-0 ${tamanos[tamano]} ${color}`}
        >
            {iniciales(nombre)}
        </div>
    );
};

export default Avatar;

import { Plus } from "lucide-react";
import { NAV_ITEMS, type NavItem, type PaginaId } from "./navItems";

interface BottomNavProps {
    activa: PaginaId;
    onNavegar: (id: PaginaId) => void;
    onNuevaCita: () => void;
}

/** Navegación inferior para celular (se oculta desde md). */
const BottomNav = ({ activa, onNavegar, onNuevaCita }: BottomNavProps) => {
    const izquierda = NAV_ITEMS.slice(0, 2);
    const derecha = NAV_ITEMS.slice(2);

    const renderItem = (item: NavItem) => {
        const activo = activa === item.id;
        const Icon = item.icon;
        return (
            <button
                key={item.id}
                type="button"
                onClick={() => onNavegar(item.id)}
                aria-current={activo ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-1 text-[11px] transition-colors
                    ${activo ? "font-bold text-baya-600" : "font-semibold text-suave hover:text-tinta"}`}
            >
                <span
                    className={`w-[52px] h-[30px] rounded-full grid place-items-center transition-colors
                        ${activo ? "bg-baya-100" : ""}`}
                >
                    <Icon size={20} strokeWidth={1.8} />
                </span>
                {item.label}
            </button>
        );
    };

    return (
        <nav
            aria-label="Principal"
            className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-linea pb-safe"
        >
            <div className="grid grid-cols-5 items-center max-w-md mx-auto px-2 pt-2">
                {izquierda.map(renderItem)}
                <div className="flex justify-center">
                    <button
                        type="button"
                        aria-label="Nueva cita"
                        onClick={onNuevaCita}
                        className="-mt-8 w-14 h-14 rounded-[20px] bg-baya-600 text-white grid place-items-center
                            shadow-lg shadow-baya-900/25 transition active:scale-95 hover:bg-baya-700"
                    >
                        <Plus size={26} strokeWidth={2} />
                    </button>
                </div>
                {derecha.map(renderItem)}
            </div>
        </nav>
    );
};

export default BottomNav;

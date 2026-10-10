import { Plus } from "lucide-react";
import Logo from "../ui/Logo";
import { NAV_ITEMS, type PaginaId } from "./navItems";

interface SidebarProps {
    activa: PaginaId;
    onNavegar: (id: PaginaId) => void;
    onNuevaCita: () => void;
}

/** Barra lateral para tablet y escritorio (visible desde md). */
const Sidebar = ({ activa, onNavegar, onNuevaCita }: SidebarProps) => {
    return (
        <aside className="hidden md:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen bg-white border-r border-linea px-4 py-6">
            <div className="px-2">
                <Logo />
            </div>

            <button
                type="button"
                onClick={onNuevaCita}
                className="mt-7 h-12 rounded-xl bg-baya-600 text-white text-sm font-bold flex items-center justify-center gap-2
                    shadow-sm shadow-baya-900/10 transition hover:bg-baya-700 active:scale-[0.98]"
            >
                <Plus size={19} strokeWidth={2} />
                Nueva cita
            </button>

            <nav aria-label="Principal" className="mt-6 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                    const activo = activa === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onNavegar(item.id)}
                            aria-current={activo ? "page" : undefined}
                            className={`h-11 rounded-xl flex items-center gap-3 px-3 text-sm transition-colors
                                ${activo
                                    ? "bg-baya-100 text-baya-800 font-bold"
                                    : "text-[#4A3540] font-semibold hover:bg-crema"
                                }`}
                        >
                            <Icon size={20} strokeWidth={1.8} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto rounded-2xl bg-crema p-4">
                <p className="font-display text-base font-medium leading-snug">
                    Tu agenda, <span className="italic text-baya-600">siempre a mano.</span>
                </p>
                <p className="text-xs text-suave mt-1">NailBook · Agenda de citas</p>
            </div>
        </aside>
    );
};

export default Sidebar;

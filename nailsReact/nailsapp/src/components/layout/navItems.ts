import { CalendarDays, House, LayoutGrid, Users, type LucideIcon } from "lucide-react";

export type PaginaId = "dashboard" | "citas" | "clientes" | "servicios";

export interface NavItem {
    id: PaginaId;
    label: string;
    icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
    { id: "dashboard", label: "Inicio", icon: House },
    { id: "citas", label: "Agenda", icon: CalendarDays },
    { id: "clientes", label: "Clientas", icon: Users },
    { id: "servicios", label: "Servicios", icon: LayoutGrid },
];

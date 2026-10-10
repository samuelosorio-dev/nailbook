import { LayoutGrid } from "lucide-react";
import type { ServicioResponse } from "../../models/servicio.model";
import EmptyState from "../ui/EmptyState";
import Skeleton from "../ui/Skeleton";
import ServicioCard from "./ServicioCard";

interface ServicioListProps {
    servicios: ServicioResponse[];
    onEdit: (servicio: ServicioResponse) => void;
    loading?: boolean;
}

const ServicioList = ({ servicios, onEdit, loading = false }: ServicioListProps) => {
    if (loading) {
        return <Skeleton className="h-72 rounded-[22px]" />;
    }

    if (servicios.length === 0) {
        return (
            <EmptyState
                icon={LayoutGrid}
                titulo="Sin servicios de este tipo"
                descripcion="Agrega un servicio con su precio y duración."
            />
        );
    }

    const duracionMaxima = Math.max(...servicios.map((s) => s.duracion));
    const ordenados = [...servicios].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

    return (
        <div className="bg-white border border-linea rounded-[22px] divide-y divide-[#F3E9EC] overflow-hidden">
            {ordenados.map((servicio) => (
                <ServicioCard
                    key={servicio.id}
                    servicio={servicio}
                    onEdit={onEdit}
                    duracionMaxima={duracionMaxima}
                />
            ))}
        </div>
    );
};

export default ServicioList;

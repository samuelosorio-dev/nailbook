import { Pencil } from "lucide-react";
import type { ServicioResponse } from "../../models/servicio.model";
import { formatCOP } from "../../utils/formato";
import IconButton from "../ui/IconButton";

interface ServicioCardProps {
    servicio: ServicioResponse;
    onEdit: (servicio: ServicioResponse) => void;
    duracionMaxima: number;
}

/** Fila de la carta de servicios, con barra de duración relativa. */
const ServicioCard = ({ servicio, onEdit, duracionMaxima }: ServicioCardProps) => {
    const porcentaje = duracionMaxima > 0 ? Math.max((servicio.duracion / duracionMaxima) * 100, 8) : 0;

    return (
        <div className="flex items-center gap-3 py-3 pl-4 pr-2">
            <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold truncate">{servicio.nombre}</p>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className="block h-1 w-24 rounded-full bg-[#F3E9EC] overflow-hidden" aria-hidden="true">
                        <span className="block h-full rounded-full bg-baya-600" style={{ width: `${porcentaje}%` }} />
                    </span>
                    <span className="text-xs text-suave">{servicio.duracion} min</span>
                </div>
            </div>
            <p className="font-display text-lg font-semibold whitespace-nowrap">{formatCOP(servicio.valor)}</p>
            <IconButton icon={Pencil} label={`Editar ${servicio.nombre}`} onClick={() => onEdit(servicio)} variant="ghost" />
        </div>
    );
};

export default ServicioCard;

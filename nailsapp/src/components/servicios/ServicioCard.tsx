
import type { ServicioResponse } from "../../models/servicio.model";
import Card from "../ui/Card";

interface ServicioCardProps {
    servicio: ServicioResponse;
    onEdit: (servicio: ServicioResponse) => void;
}

const ServicioCard = ({ servicio, onEdit }: ServicioCardProps) => {
    return (
        <Card>
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{servicio.nombre}</span>
                    <span className="text-xs text-gray-400 mt-0.5">
                        ⏱ {servicio.duracion} minutos
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-rose-500">
                        $ {servicio.valor.toLocaleString("es-CO")}
                    </span>
                    <button
                        onClick={() => onEdit(servicio)}
                        className="w-8 h-8 rounded-full border border-rose-100 flex items-center justify-center text-rose-400 hover:bg-rose-50 transition-all"
                    >
                        ✎
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default ServicioCard;
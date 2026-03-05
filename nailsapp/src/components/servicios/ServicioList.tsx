
import { TipoServicio, type ServicioResponse } from "../../models/servicio.model";
import ServicioCard from "./ServicioCard";

interface ServicioListProps {
    servicios: ServicioResponse[];
    onEdit: (servicio: ServicioResponse) => void;
    loading?: boolean;
}

const ServicioList = ({ servicios, onEdit, loading = false }: ServicioListProps) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 rounded-full border-2 border-rose-300 border-t-rose-500 animate-spin" />
            </div>
        );
    }

    if (servicios.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-4xl mb-3">✦</div>
                <p className="text-gray-400 text-sm">No hay servicios registrados aún</p>
            </div>
        );
    }

    const serviciosManos = servicios.filter(s => s.tipo === TipoServicio.Manos);
    const serviciosPies = servicios.filter(s => s.tipo === TipoServicio.Pies);

    return (
        <div className="space-y-6">
            {/* Sección Manos */}
            {serviciosManos.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-400 tracking-widest mb-3">
                        MANOS
                    </p>
                    <div className="space-y-3">
                        {serviciosManos.map((servicio) => (
                            <ServicioCard
                                key={servicio.id}
                                servicio={servicio}
                                onEdit={onEdit}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Sección Pies */}
            {serviciosPies.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-400 tracking-widest mb-3">
                        PIES
                    </p>
                    <div className="space-y-3">
                        {serviciosPies.map((servicio) => (
                            <ServicioCard
                                key={servicio.id}
                                servicio={servicio}
                                onEdit={onEdit}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicioList;
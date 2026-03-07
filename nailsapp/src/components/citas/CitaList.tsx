import type { CitaResponse } from "../../models/cita.model";
import CitaCard from "./CitaCard";

interface CitaListProps {
    citas: CitaResponse[];
    onEdit: (cita: CitaResponse) => void;
    onCancelar: (id: number) => void;
    onFinalizar: (id:number) => void;
    loading?: boolean;
}

const CitaList = ({ citas, onEdit, onCancelar,onFinalizar, loading = false }: CitaListProps) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 rounded-full border-2 border-rose-300 border-t-rose-500 animate-spin" />
            </div>
        );
    }

    if (citas.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-4xl mb-3">✦</div>
                <p className="text-gray-400 text-sm">No hay citas registradas</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {citas.map((cita) => (
                <CitaCard
                    key={cita.id}
                    cita={cita}
                    onEdit={onEdit}
                    onCancelar={onCancelar}
                    onFinalizar={onFinalizar}
                />
            ))}
        </div>
    );
};

export default CitaList;
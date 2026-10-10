import { CalendarX } from "lucide-react";
import type { CitaResponse } from "../../models/cita.model";
import EmptyState from "../ui/EmptyState";
import Skeleton from "../ui/Skeleton";
import CitaCard from "./CitaCard";

interface CitaListProps {
    citas: CitaResponse[];
    onEdit: (cita: CitaResponse) => void;
    onCancelar: (id: number) => void;
    onFinalizar: (id: number) => void;
    loading?: boolean;
}

const CitaList = ({ citas, onEdit, onCancelar, onFinalizar, loading = false }: CitaListProps) => {
    if (loading) {
        return (
            <div className="flex flex-col gap-2.5">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[104px] rounded-[20px]" />)}
            </div>
        );
    }

    if (citas.length === 0) {
        return (
            <EmptyState
                icon={CalendarX}
                titulo="Día libre"
                descripcion="No hay citas para este día con el filtro seleccionado."
            />
        );
    }

    return (
        <div className="flex flex-col gap-2.5">
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

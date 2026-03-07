import { useRef, useState } from "react";
import { EstadoCita, type CitaResponse } from "../../models/cita.model";
import Card from "../ui/Card";
import { AlarmClock, CalendarDays, Hourglass } from "lucide-react";

interface CitaCardProps {
    cita: CitaResponse;
    onEdit: (cita: CitaResponse) => void;
    onCancelar: (id: number) => void;
    onFinalizar: (id: number) => void;
}

const estadoConfig: Record<number, { label: string; className: string }> = {
    [EstadoCita.Programada]: { label: "Programada", className: "bg-rose-100 text-rose-500" },
    [EstadoCita.Finalizada]: { label: "Finalizada", className: "bg-emerald-100 text-emerald-500" },
    [EstadoCita.Cancelada]: { label: "Cancelada", className: "bg-gray-100 text-gray-400" },
};

const formatearFecha = (fecha: string): string => {
    const [anio, mes, dia] = fecha.split("-");
    const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    return `${dia} ${meses[parseInt(mes) - 1]} ${anio}`;
};

const CitaCard = ({ cita, onEdit, onCancelar, onFinalizar }: CitaCardProps) => {
    const [offsetX, setOffsetX] = useState(0);
    const [confirmacion, setConfirmacion] = useState<"cancelar" | "finalizar" | null>(null);
    const startXRef = useRef<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const estado = estadoConfig[cita.estado];
    const esProgramada = cita.estado === EstadoCita.Programada;
    const nombresServicios = cita.servicios.map(s => s.nombre).join(" • ");
    const horaFormateada = cita.horaInicio.substring(0, 5);

    const handleTouchStart = (e: React.TouchEvent) => {
    if (!esProgramada) return;
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);  // ← setIsDragging
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || startXRef.current === null) return;  // ← sin .current
        const diff = e.touches[0].clientX - startXRef.current;
        if (diff < 0) setOffsetX(Math.max(diff, -80));
        if (diff > 0) setOffsetX(Math.min(diff, 80));
    };

    const handleTouchEnd = () => {
        setIsDragging(false);  // ← setIsDragging
        if (offsetX <= -60) setConfirmacion("cancelar");
        else if (offsetX >= 60) setConfirmacion("finalizar");
        setOffsetX(0);
        startXRef.current = null;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
    if (!esProgramada) return;
    startXRef.current = e.clientX;
    setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || startXRef.current === null) return;
        const diff = e.clientX - startXRef.current;
        if (diff < 0) setOffsetX(Math.max(diff, -80));
        if (diff > 0) setOffsetX(Math.min(diff, 80));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (offsetX <= -60) setConfirmacion("cancelar");
        else if (offsetX >= 60) setConfirmacion("finalizar");
        setOffsetX(0);
        startXRef.current = null;
    };

    const confirmar = () => {
        if (confirmacion === "cancelar") onCancelar(cita.id);
        if (confirmacion === "finalizar") onFinalizar(cita.id);
        setConfirmacion(null);
    };

    return (
        <>
            {/* Modal de confirmación */}
            {confirmacion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
                    style={{ background: "rgba(0,0,0,0.3)" }}
                >
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
                        <p className="font-semibold text-gray-800 text-center mb-2">
                            {confirmacion === "cancelar" ? "¿Cancelar cita?" : "¿Marcar como finalizada?"}
                        </p>
                        <p className="text-sm text-gray-400 text-center mb-6">
                            {confirmacion === "cancelar"
                                ? "Esta acción no se puede deshacer."
                                : `Cita de ${cita.clienteNombre} será marcada como finalizada.`
                            }
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmacion(null)}
                                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-400 text-sm font-medium hover:bg-gray-50 transition-all"
                            >
                                No, volver
                            </button>
                            <button
                                onClick={confirmar}
                                className="flex-1 py-3 rounded-2xl text-white text-sm font-medium transition-all"
                                style={{
                                    background: confirmacion === "cancelar"
                                        ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                                        : "linear-gradient(135deg, #10b981, #059669)"
                                }}
                            >
                                {confirmacion === "cancelar" ? "Sí, cancelar" : "Sí, finalizar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Card con swipe */}
            <div className="relative overflow-hidden rounded-2xl">
                {/* Fondo izquierda — cancelar */}
                {esProgramada && (
                    <div className="absolute inset-0 flex items-center justify-end pr-5 rounded-2xl bg-gray-100">
                        <span className="text-xs text-gray-400 font-medium">Cancelar ✕</span>
                    </div>
                )}
                {/* Fondo derecha — finalizar */}
                {esProgramada && (
                    <div className="absolute inset-0 flex items-center justify-start pl-5 rounded-2xl bg-emerald-50">
                        <span className="text-xs text-emerald-500 font-medium">✓ Finalizar</span>
                    </div>
                )}

                {/* Card deslizable */}
                <div
                    style={{ 
                        transform: `translateX(${offsetX}px)`, 
                        transition: isDragging ? "none" : "transform 0.3s ease"  
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp} 
                >
                    <Card>
                        <div className="flex flex-col gap-2">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                        esProgramada ? "bg-rose-400" :
                                        cita.estado === EstadoCita.Finalizada ? "bg-emerald-400" :
                                        "bg-gray-300"
                                    }`} />
                                    <span className="font-semibold text-gray-800">{cita.clienteNombre}</span>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${estado.className}`}>
                                    {estado.label}
                                </span>
                            </div>

                            {/* Servicios */}
                            <p className={`text-sm ${esProgramada ? "text-gray-500" : "text-gray-400"}`}>
                                {nombresServicios}
                            </p>

                            {/* Fecha, hora y duración */}
                            <div className="flex items-center gap-3">
                                <span className="flex items-center text-xs text-gray-400"><CalendarDays size={15} className="-mt-[3px] text-gray-500 mr-1"/> {formatearFecha(cita.fecha)}</span>
                                <span className="flex items-center text-xs text-gray-400"><AlarmClock size={15} className="-mt-[3px] text-gray-500 mr-1"/> {horaFormateada}</span>
                                <span className="flex items-center text-xs text-gray-400"><Hourglass size={15} className="-mt-[3px] text-gray-500 mr-1"/> {cita.duracion} min</span>
                            </div>

                            {/* Botones solo en Programada */}
                            {esProgramada && (
                                <div className="flex items-center gap-2 mt-1">
                                    <button
                                        onClick={() => onEdit(cita)}
                                        className="text-xs px-3 py-1.5 rounded-full border border-rose-200 text-rose-400 hover:bg-rose-50 transition-all"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => setConfirmacion("cancelar")}
                                        className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default CitaCard;
import { useRef, useState } from "react";
import { Check, CircleCheck, CircleX, Pencil, X } from "lucide-react";
import { EstadoCita, type CitaResponse } from "../../models/cita.model";
import { horaCorta } from "../../utils/fechas";
import { formatCOP } from "../../utils/formato";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import IconButton from "../ui/IconButton";
import { estadoInfo } from "./estadoCita";

interface CitaCardProps {
    cita: CitaResponse;
    onEdit: (cita: CitaResponse) => void;
    onCancelar: (id: number) => void;
    onFinalizar: (id: number) => void;
}

const CitaCard = ({ cita, onEdit, onCancelar, onFinalizar }: CitaCardProps) => {
    const [offsetX, setOffsetX] = useState(0);
    const [confirmacion, setConfirmacion] = useState<"cancelar" | "finalizar" | null>(null);
    const startXRef = useRef<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const estado = estadoInfo[cita.estado];
    const esProgramada = cita.estado === EstadoCita.Programada;
    const esCancelada = cita.estado === EstadoCita.Cancelada;
    const esFinalizada = cita.estado === EstadoCita.Finalizada;
    const nombresServicios = cita.servicios.map((s) => s.nombre).join(" + ");
    const valorTotal = cita.servicios.reduce((acc, s) => acc + s.valor, 0);

    // ---- Deslizar: derecha = finalizar, izquierda = cancelar (misma lógica de antes)
    const iniciarArrastre = (x: number) => {
        if (!esProgramada) return;
        startXRef.current = x;
        setIsDragging(true);
    };

    const moverArrastre = (x: number) => {
        if (!isDragging || startXRef.current === null) return;
        const diff = x - startXRef.current;
        if (diff < 0) setOffsetX(Math.max(diff, -90));
        if (diff > 0) setOffsetX(Math.min(diff, 90));
    };

    const terminarArrastre = () => {
        if (!isDragging) return;
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
            {confirmacion && (
                <ConfirmDialog
                    titulo={confirmacion === "cancelar" ? "¿Cancelar esta cita?" : "¿Marcar como finalizada?"}
                    mensaje={
                        confirmacion === "cancelar"
                            ? `La cita de ${cita.clienteNombre} se cancelará. Esta acción no se puede deshacer.`
                            : `La cita de ${cita.clienteNombre} pasará a finalizada.`
                    }
                    textoConfirmar={confirmacion === "cancelar" ? "Sí, cancelar" : "Sí, finalizar"}
                    tono={confirmacion === "cancelar" ? "peligro" : "exito"}
                    onConfirmar={confirmar}
                    onCancelar={() => setConfirmacion(null)}
                />
            )}

            <div className="relative overflow-hidden rounded-[20px]">
                {/* Fondos que aparecen al deslizar */}
                {esProgramada && (
                    <>
                        <div className="absolute inset-y-0 left-0 w-1/2 flex items-center pl-4 bg-salvia-50 text-salvia-700">
                            <span className="flex items-center gap-1.5 text-xs font-bold">
                                <CircleCheck size={16} /> Finalizar
                            </span>
                        </div>
                        <div className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-end pr-4 bg-red-500 text-white">
                            <span className="flex items-center gap-1.5 text-xs font-bold">
                                Cancelar <CircleX size={16} />
                            </span>
                        </div>
                    </>
                )}

                <article
                    style={{
                        transform: `translateX(${offsetX}px)`,
                        transition: isDragging ? "none" : "transform 0.3s ease",
                    }}
                    onTouchStart={(e) => iniciarArrastre(e.touches[0].clientX)}
                    onTouchMove={(e) => moverArrastre(e.touches[0].clientX)}
                    onTouchEnd={terminarArrastre}
                    onMouseDown={(e) => iniciarArrastre(e.clientX)}
                    onMouseMove={(e) => moverArrastre(e.clientX)}
                    onMouseUp={terminarArrastre}
                    onMouseLeave={terminarArrastre}
                    className={`relative flex gap-3 p-3.5 rounded-[20px] select-none
                        ${esCancelada
                            ? "bg-crema border border-dashed border-[#DCC8CF]"
                            : "bg-white border border-linea"
                        }
                        ${esFinalizada ? "opacity-80" : ""}`}
                >
                    {/* Hora */}
                    <div className="w-[50px] flex-shrink-0 text-center pt-0.5">
                        <p
                            className={`text-[15px] font-bold
                                ${esCancelada ? "text-tenue line-through" : esProgramada ? "text-baya-600" : "text-tinta"}`}
                        >
                            {horaCorta(cita.horaInicio)}
                        </p>
                        {!esCancelada && <p className="text-[11px] text-suave">{horaCorta(cita.horaFin)}</p>}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <p className={`text-[15px] leading-snug ${esCancelada ? "font-semibold text-suave" : "font-bold"}`}>
                                {cita.clienteNombre}
                                {cita.clienteAlias && (
                                    <span className="text-xs font-semibold text-baya-600 ml-1.5">@{cita.clienteAlias}</span>
                                )}
                            </p>
                            <Badge label={estado.label} variant={estado.variante} />
                        </div>

                        <p className={`text-[13px] mt-0.5 ${esCancelada ? "text-tenue" : "text-suave"}`}>{nombresServicios}</p>

                        {!esCancelada && (
                            <p className="text-xs text-suave mt-1.5">
                                {cita.duracion} min · <strong className="text-tinta">{formatCOP(valorTotal)}</strong>
                            </p>
                        )}

                        {esProgramada && (
                            <div className="flex gap-1.5 mt-3">
                                <div className="flex-1">
                                    <Button
                                        label="Finalizar"
                                        icon={Check}
                                        size="sm"
                                        fullWidth
                                        onClick={() => setConfirmacion("finalizar")}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Button
                                        label="Editar"
                                        icon={Pencil}
                                        size="sm"
                                        variant="secondary"
                                        fullWidth
                                        onClick={() => onEdit(cita)}
                                    />
                                </div>
                                <IconButton
                                    icon={X}
                                    label="Cancelar cita"
                                    size="sm"
                                    onClick={() => setConfirmacion("cancelar")}
                                />
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </>
    );
};

export default CitaCard;

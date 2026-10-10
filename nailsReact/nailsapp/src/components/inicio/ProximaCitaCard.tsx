import { useState } from "react";
import { ArrowRight, Check, Clock, Plus } from "lucide-react";
import fondo from "../../assets/fondo.png";
import type { CitaResponse } from "../../models/cita.model";
import { aMinutos, duracionTexto, horaActual, horaCorta } from "../../utils/fechas";
import { formatCOP } from "../../utils/formato";
import ConfirmDialog from "../ui/ConfirmDialog";
import Skeleton from "../ui/Skeleton";

interface ProximaCitaCardProps {
    cita: CitaResponse | null;
    posicion: number;
    total: number;
    loading: boolean;
    onFinalizar: (id: number) => void;
    onVerAgenda: () => void;
    onNuevaCita: () => void;
}

const a12h = (hora: string) => {
    const [h, m] = horaCorta(hora).split(":").map(Number);
    return { hora: `${h % 12 || 12}:${String(m).padStart(2, "0")}`, sufijo: h < 12 ? "am" : "pm" };
};

const estadoTiempo = (cita: CitaResponse): string => {
    const ahora = aMinutos(horaActual());
    const inicio = aMinutos(cita.horaInicio);
    const fin = aMinutos(cita.horaFin);
    if (ahora >= inicio && ahora < fin) return `En curso · termina ${horaCorta(cita.horaFin)}`;
    if (ahora >= fin) return "Pendiente de finalizar";
    const faltan = inicio - ahora;
    return `Próxima cita · en ${duracionTexto(faltan)}`;
};

const ProximaCitaCard = ({ cita, posicion, total, loading, onFinalizar, onVerAgenda, onNuevaCita }: ProximaCitaCardProps) => {
    const [confirmar, setConfirmar] = useState(false);

    if (loading) return <Skeleton className="h-[236px] rounded-[24px]" />;

    const hora = cita ? a12h(cita.horaInicio) : null;
    const valorTotal = cita ? cita.servicios.reduce((acc, s) => acc + s.valor, 0) : 0;

    return (
        <section className="relative overflow-hidden rounded-[24px] bg-baya-800 text-white">
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-20 bg-center"
                style={{ backgroundImage: `url(${fondo})`, backgroundSize: "560px auto" }}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-baya-800/70" />

            <div className="relative p-5 md:p-6 flex flex-col gap-4">
                {cita && hora ? (
                    <>
                        <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 px-2.5 py-1.5 rounded-full">
                                <Clock size={14} strokeWidth={2} />
                                {estadoTiempo(cita)}
                            </span>
                            <span className="text-xs text-[#F3D3DE]">
                                {posicion} de {total} hoy
                            </span>
                        </div>

                        <div className="flex items-end gap-4 flex-wrap">
                            <p className="font-display font-medium text-[52px] md:text-[58px] leading-[0.9] tracking-tight">
                                {hora.hora}
                                <span className="text-xl italic ml-1">{hora.sufijo}</span>
                            </p>
                            <div className="pb-1 min-w-0">
                                <p className="text-[17px] font-bold truncate">{cita.clienteNombre}</p>
                                <p className="text-[13px] text-[#F3D3DE]">
                                    {cita.clienteAlias ? `@${cita.clienteAlias} · ` : ""}
                                    {cita.duracion} min · {formatCOP(valorTotal)}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-1.5 flex-wrap">
                            {cita.servicios.map((s) => (
                                <span key={s.id} className="text-xs px-2.5 py-1 rounded-full border border-white/35">
                                    {s.nombre}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setConfirmar(true)}
                                className="flex-1 h-11 rounded-xl bg-white text-baya-800 text-sm font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
                            >
                                <Check size={17} strokeWidth={2.2} />
                                Finalizar
                            </button>
                            <button
                                type="button"
                                onClick={onVerAgenda}
                                className="flex-1 h-11 rounded-xl border border-white/40 text-sm font-semibold flex items-center justify-center gap-1.5 transition hover:bg-white/10"
                            >
                                Ver agenda
                                <ArrowRight size={16} strokeWidth={2} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="py-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#F3D3DE]">Sin pendientes</p>
                        <p className="font-display text-[28px] font-medium leading-tight mt-1">
                            No tienes más citas <span className="italic">por hoy</span>
                        </p>
                        <button
                            type="button"
                            onClick={onNuevaCita}
                            className="mt-5 h-11 px-4 rounded-xl bg-white text-baya-800 text-sm font-bold inline-flex items-center gap-1.5 transition active:scale-[0.98]"
                        >
                            <Plus size={17} strokeWidth={2.2} />
                            Agendar cita
                        </button>
                    </div>
                )}
            </div>

            {confirmar && cita && (
                <ConfirmDialog
                    titulo="¿Marcar como finalizada?"
                    mensaje={`La cita de ${cita.clienteNombre} pasará a finalizada.`}
                    textoConfirmar="Sí, finalizar"
                    tono="exito"
                    onCancelar={() => setConfirmar(false)}
                    onConfirmar={() => {
                        onFinalizar(cita.id);
                        setConfirmar(false);
                    }}
                />
            )}
        </section>
    );
};

export default ProximaCitaCard;

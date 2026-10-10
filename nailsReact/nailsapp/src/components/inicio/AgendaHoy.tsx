import { useState } from "react";
import { CalendarCheck, ChevronDown, Footprints, Hand } from "lucide-react";
import { EstadoCita, type CitaResponse } from "../../models/cita.model";
import { TipoServicio } from "../../models/servicio.model";
import { horaCorta } from "../../utils/fechas";
import { formatCOP } from "../../utils/formato";
import Skeleton from "../ui/Skeleton";

interface AgendaHoyProps {
    citas: CitaResponse[];
    proximaId: number | null;
    loading: boolean;
    onVerAgenda: () => void;
}

const AgendaHoy = ({ citas, proximaId, loading, onVerAgenda }: AgendaHoyProps) => {
    const [abierta, setAbierta] = useState<number | null>(null);
    const ordenadas = [...citas].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    return (
        <section className="bg-white border border-linea rounded-[22px] p-5">
            <div className="flex items-baseline justify-between mb-3">
                <h2 className="font-display text-[19px] font-semibold">Agenda de hoy</h2>
                <button type="button" onClick={onVerAgenda} className="text-[13px] font-semibold text-baya-600 hover:text-baya-800">
                    Ver agenda
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}
                </div>
            ) : ordenadas.length === 0 ? (
                <div className="flex flex-col items-center text-center py-6">
                    <CalendarCheck size={26} strokeWidth={1.6} className="text-baya-400 mb-2" />
                    <p className="text-sm text-suave">No hay citas agendadas para hoy</p>
                </div>
            ) : (
                <ol className="flex flex-col">
                    {ordenadas.map((cita, i) => {
                        const finalizada = cita.estado === EstadoCita.Finalizada;
                        const cancelada = cita.estado === EstadoCita.Cancelada;
                        const esProxima = cita.id === proximaId;
                        const ultima = i === ordenadas.length - 1;
                        const expandida = abierta === cita.id;
                        const total = cita.servicios.reduce((acc, s) => acc + s.valor, 0);

                        const punto = finalizada
                            ? "w-2.5 h-2.5 bg-salvia-600"
                            : cancelada
                                ? "w-2.5 h-2.5 bg-[#C9BBC1]"
                                : esProxima
                                    ? "w-3 h-3 bg-baya-600 ring-4 ring-baya-100"
                                    : "w-2.5 h-2.5 border-2 border-baya-600 bg-white";

                        return (
                            <li key={cita.id} className="grid grid-cols-[48px_14px_1fr] gap-2.5">
                                <span
                                    className={`text-[13px] font-bold pt-3
                                        ${cancelada || finalizada ? "text-tenue line-through" : esProxima ? "text-baya-600" : "text-tinta"}`}
                                >
                                    {horaCorta(cita.horaInicio)}
                                </span>
                                <div className="flex flex-col items-center">
                                    <span className={`rounded-full mt-[15px] flex-shrink-0 ${punto}`} />
                                    {!ultima && <span className="flex-1 w-0.5 bg-linea" />}
                                </div>
                                <div className="pb-2 pt-1 min-w-0">
                                    <button
                                        type="button"
                                        onClick={() => setAbierta(expandida ? null : cita.id)}
                                        aria-expanded={expandida}
                                        className={`w-full text-left rounded-2xl px-3 py-2 transition
                                            ${esProxima ? "bg-baya-50 border border-baya-200" : "hover:bg-crema"}`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-sm truncate ${cancelada ? "text-tenue font-semibold" : "font-bold"}`}>
                                                {cita.clienteNombre}
                                                {cita.clienteAlias && (
                                                    <span className="font-semibold text-xs text-baya-600 ml-1.5">@{cita.clienteAlias}</span>
                                                )}
                                            </p>
                                            <ChevronDown
                                                size={16}
                                                className={`text-suave flex-shrink-0 transition-transform ${expandida ? "rotate-180" : ""}`}
                                            />
                                        </div>
                                        <p className={`text-xs truncate ${finalizada ? "text-salvia-700 font-semibold" : cancelada ? "text-tenue" : "text-suave"}`}>
                                            {finalizada ? "Finalizada · " : cancelada ? "Cancelada · " : ""}
                                            {cita.servicios.map((s) => s.nombre).join(" + ")}
                                        </p>
                                    </button>

                                    {expandida && (
                                        <div className="mx-3 mt-1 mb-2 flex flex-col gap-2 animate-fade-in">
                                            {cita.servicios.map((s) => {
                                                const Icon = s.tipo === TipoServicio.Manos ? Hand : Footprints;
                                                return (
                                                    <div key={s.id} className="flex items-center justify-between gap-2 text-sm">
                                                        <span className="flex items-center gap-2 text-suave min-w-0">
                                                            <Icon size={15} strokeWidth={1.8} className="flex-shrink-0" />
                                                            <span className="truncate">{s.nombre}</span>
                                                        </span>
                                                        <span className="font-semibold">{formatCOP(s.valor)}</span>
                                                    </div>
                                                );
                                            })}
                                            <div className="flex justify-between pt-2 border-t border-linea text-sm">
                                                <span className="font-semibold text-suave">Total · {cita.duracion} min</span>
                                                <span className="font-bold text-baya-700">{formatCOP(total)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}
        </section>
    );
};

export default AgendaHoy;

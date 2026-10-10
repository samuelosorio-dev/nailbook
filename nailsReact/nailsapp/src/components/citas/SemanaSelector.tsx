import { ChevronLeft, ChevronRight } from "lucide-react";
import { DIAS_CORTOS, fechaLocalISO, parseFecha, semanaDe, sumarDias } from "../../utils/fechas";

interface SemanaSelectorProps {
    fecha: string;
    onCambiar: (fecha: string) => void;
}

const SemanaSelector = ({ fecha, onCambiar }: SemanaSelectorProps) => {
    const dias = semanaDe(fecha);
    const hoy = fechaLocalISO();

    const flecha =
        "w-8 h-[68px] rounded-xl grid place-items-center text-suave hover:bg-white hover:text-tinta transition flex-shrink-0";

    return (
        <div className="flex items-center gap-1">
            <button type="button" aria-label="Semana anterior" onClick={() => onCambiar(sumarDias(fecha, -7))} className={flecha}>
                <ChevronLeft size={18} />
            </button>

            <div role="group" aria-label="Días de la semana" className="flex-1 grid grid-cols-7 gap-1">
                {dias.map((dia) => {
                    const d = parseFecha(dia);
                    const seleccionado = dia === fecha;
                    const esHoy = dia === hoy;
                    return (
                        <button
                            key={dia}
                            type="button"
                            onClick={() => onCambiar(dia)}
                            aria-pressed={seleccionado}
                            aria-current={esHoy ? "date" : undefined}
                            className={`h-[68px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all
                                ${seleccionado
                                    ? "bg-baya-600 text-white shadow-md shadow-baya-900/20"
                                    : "hover:bg-white"
                                }`}
                        >
                            <span
                                className={`text-[11px] font-semibold
                                    ${seleccionado ? "text-[#F3D3DE]" : esHoy ? "text-baya-600" : "text-suave"}`}
                            >
                                {DIAS_CORTOS[d.getDay()]}
                            </span>
                            <span className={`text-[17px] font-bold ${seleccionado ? "" : esHoy ? "text-baya-600" : "text-tinta"}`}>
                                {d.getDate()}
                            </span>
                            <span
                                className={`w-1 h-1 rounded-full ${esHoy ? (seleccionado ? "bg-white" : "bg-baya-600") : "bg-transparent"}`}
                            />
                        </button>
                    );
                })}
            </div>

            <button type="button" aria-label="Semana siguiente" onClick={() => onCambiar(sumarDias(fecha, 7))} className={flecha}>
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default SemanaSelector;

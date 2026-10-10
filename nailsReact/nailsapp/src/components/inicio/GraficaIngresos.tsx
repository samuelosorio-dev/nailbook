import type { IngresosDiaDto } from "../../models/dashboard.model";
import { MESES_CORTOS } from "../../utils/fechas";
import { formatCOP, formatCOPCorto } from "../../utils/formato";
import Skeleton from "../ui/Skeleton";

interface GraficaIngresosProps {
    datos: IngresosDiaDto[];
    totalMes: number;
    loading: boolean;
}

const ALTURA = 130;

const GraficaIngresos = ({ datos, totalMes, loading }: GraficaIngresosProps) => {
    const hoy = new Date();
    const diaHoy = hoy.getDate();
    const diasDelMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    const mes = MESES_CORTOS[hoy.getMonth()];

    // Completa todos los días del mes (los que no vienen del API quedan en 0)
    const porDia = new Map(datos.map((d) => [d.dia, d.total]));
    const dias = Array.from({ length: diasDelMes }, (_, i) => ({ dia: i + 1, total: porDia.get(i + 1) ?? 0 }));

    const max = Math.max(0, ...dias.map((d) => d.total));
    const mejorDia = max > 0 ? dias.find((d) => d.total === max) : null;

    return (
        <section className="bg-white border border-linea rounded-[22px] p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="font-display text-[19px] font-semibold">Ingresos del mes</h2>
                    <p className="font-display text-2xl font-semibold text-baya-600 mt-0.5">
                        {loading ? "–" : formatCOP(totalMes)}
                    </p>
                </div>
                {mejorDia && !loading && (
                    <div className="text-right">
                        <p className="text-xs text-suave">Mejor día</p>
                        <p className="text-sm font-bold">
                            {mejorDia.dia} {mes} · {formatCOPCorto(mejorDia.total)}
                        </p>
                    </div>
                )}
            </div>

            {loading ? (
                <Skeleton className="h-[150px] mt-4" />
            ) : max === 0 ? (
                <div className="h-[150px] mt-4 rounded-2xl bg-crema grid place-items-center">
                    <p className="text-sm text-suave">Aún no hay ingresos este mes</p>
                </div>
            ) : (
                <>
                    <div
                        className="flex items-end gap-[3px] mt-5 border-b border-linea pb-1"
                        style={{ height: ALTURA + 6 }}
                        role="img"
                        aria-label={`Ingresos diarios de ${mes}. Mejor día: ${mejorDia?.dia} con ${formatCOP(max)}`}
                    >
                        {dias.map((d) => {
                            const futuro = d.dia > diaHoy;
                            const esMax = d.total === max;
                            const altura = d.total > 0 ? Math.max((d.total / max) * ALTURA, 6) : 3;
                            const color = futuro
                                ? "bg-[#F3E9EC]"
                                : esMax
                                    ? "bg-baya-600"
                                    : d.total > 0
                                        ? "bg-baya-300"
                                        : "bg-linea";
                            return (
                                <div key={d.dia} className="flex-1 h-full flex items-end group relative">
                                    {d.total > 0 && (
                                        <span
                                            className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-tinta text-white text-[11px] font-semibold
                                                px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10"
                                        >
                                            {d.dia} {mes} · {formatCOPCorto(d.total)}
                                        </span>
                                    )}
                                    <div
                                        className={`w-full rounded-t-[4px] ${color} ${d.dia === diaHoy ? "ring-2 ring-baya-600 ring-offset-1" : ""}`}
                                        style={{ height: altura }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between text-[11px] text-suave mt-1.5">
                        <span>1 {mes}</span>
                        <span>Hoy</span>
                        <span>{diasDelMes} {mes}</span>
                    </div>
                </>
            )}
        </section>
    );
};

export default GraficaIngresos;

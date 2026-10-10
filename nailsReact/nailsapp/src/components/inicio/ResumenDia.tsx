import type { DashboardResumenDto } from "../../models/dashboard.model";
import { MESES } from "../../utils/fechas";
import { formatCOPCorto } from "../../utils/formato";
import Skeleton from "../ui/Skeleton";

interface ResumenDiaProps {
    resumen: DashboardResumenDto | null;
    finalizadasHoy: number;
    loading: boolean;
}

const ResumenDia = ({ resumen, finalizadasHoy, loading }: ResumenDiaProps) => {
    if (loading) return <Skeleton className="h-[92px] rounded-[20px]" />;

    const mes = MESES[new Date().getMonth()];

    const celdas = [
        {
            label: "Citas hoy",
            valor: resumen ? String(resumen.citasHoy) : "–",
            detalle: `${finalizadasHoy} finalizada${finalizadasHoy === 1 ? "" : "s"}`,
            clase: "",
        },
        {
            label: "Ingresos hoy",
            valor: resumen ? formatCOPCorto(resumen.ingresosHoy) : "–",
            detalle: "Citas finalizadas",
            clase: "",
        },
        {
            label: mes.charAt(0).toUpperCase() + mes.slice(1),
            valor: resumen ? formatCOPCorto(resumen.ingresosMes) : "–",
            detalle: "Acumulado",
            clase: "",
        },
        {
            label: "Clientas activas",
            valor: resumen ? String(resumen.clientasActivas) : "–",
            detalle: "Registradas",
            clase: "hidden md:block",
        },
    ];

    return (
        <section
            aria-label="Resumen del día"
            className="bg-white border border-linea rounded-[20px] grid grid-cols-3 md:grid-cols-4 divide-x divide-linea"
        >
            {celdas.map((c) => (
                <div key={c.label} className={`px-3.5 md:px-5 py-3.5 min-w-0 ${c.clase}`}>
                    <p className="text-[11px] md:text-xs font-semibold text-suave truncate">{c.label}</p>
                    <p className="font-display text-2xl md:text-[28px] font-semibold mt-0.5 leading-tight">{c.valor}</p>
                    <p className="text-[11px] text-suave truncate">{c.detalle}</p>
                </div>
            ))}
        </section>
    );
};

export default ResumenDia;

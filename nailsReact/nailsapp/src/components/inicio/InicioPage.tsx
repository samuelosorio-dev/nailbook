import useDashboard from "../../hooks/useDashboard";
import { EstadoCita } from "../../models/cita.model";
import { aMinutos, fechaLarga, horaActual, saludo } from "../../utils/fechas";
import type { PaginaId } from "../layout/navItems";
import AlertaError from "../ui/AlertaError";
import Logo from "../ui/Logo";
import PageHeader from "../ui/PageHeader";
import AgendaHoy from "./AgendaHoy";
import GraficaIngresos from "./GraficaIngresos";
import ProximaCitaCard from "./ProximaCitaCard";
import ResumenDia from "./ResumenDia";
import TopClientas from "./TopClientas";

interface InicioPageProps {
    onNavegar: (id: PaginaId) => void;
    onNuevaCita: () => void;
}

const InicioPage = ({ onNavegar, onNuevaCita }: InicioPageProps) => {
    const { resumen, topClientas, agendaHoy, loading, error, finalizarCita } = useDashboard();

    // Próxima cita: la primera programada que no ha terminado; si todas ya pasaron, la primera pendiente
    const ahora = aMinutos(horaActual());
    const activas = agendaHoy
        .filter((c) => c.estado !== EstadoCita.Cancelada)
        .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    const programadas = activas.filter((c) => c.estado === EstadoCita.Programada);
    const proxima = programadas.find((c) => aMinutos(c.horaFin) > ahora) ?? programadas[0] ?? null;
    const posicion = proxima ? activas.findIndex((c) => c.id === proxima.id) + 1 : 0;
    const finalizadasHoy = agendaHoy.filter((c) => c.estado === EstadoCita.Finalizada).length;

    return (
        <div>
            <div className="md:hidden mb-6">
                <Logo />
            </div>

            <PageHeader eyebrow={fechaLarga()} titulo={saludo()} />

            {error && <AlertaError mensaje={error} />}

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-5 items-start">
                <div className="flex flex-col gap-4 min-w-0">
                    <ProximaCitaCard
                        cita={proxima}
                        posicion={posicion}
                        total={activas.length}
                        loading={loading && !resumen}
                        onFinalizar={finalizarCita}
                        onVerAgenda={() => onNavegar("citas")}
                        onNuevaCita={onNuevaCita}
                    />
                    <ResumenDia resumen={resumen} finalizadasHoy={finalizadasHoy} loading={loading && !resumen} />
                    <GraficaIngresos
                        datos={resumen?.graficaMes ?? []}
                        totalMes={resumen?.ingresosMes ?? 0}
                        loading={loading && !resumen}
                    />
                </div>

                <div className="flex flex-col gap-4 min-w-0">
                    <AgendaHoy
                        citas={agendaHoy}
                        proximaId={proxima?.id ?? null}
                        loading={loading && !resumen}
                        onVerAgenda={() => onNavegar("citas")}
                    />
                    <TopClientas clientas={topClientas} loading={loading && !resumen} />
                </div>
            </div>
        </div>
    );
};

export default InicioPage;

import { useState, useCallback, useEffect } from "react";
import { getAgendaHoy, getResumen, getTopClientas } from "../api/dashboardApi";
import { cambiarEstadoCita } from "../api/citasApi";
import type { DashboardResumenDto, TopClientaDto } from "../models/dashboard.model";
import { EstadoCita, type CitaResponse } from "../models/cita.model";
import useAlerta from "./useAlerta";

const useDashboard = () => {
    const { mostrarAlerta } = useAlerta();
    const [resumen, setResumen] = useState<DashboardResumenDto | null>(null);
    const [topClientas, setTopClientas] = useState<TopClientaDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [agendaHoy, setAgendaHoy] = useState<CitaResponse[]>([]);

    const cargarDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [resumenData, topData, agendaData] = await Promise.all([
                getResumen(),
                getTopClientas(),
                getAgendaHoy(),
            ]);
            setResumen(resumenData);
            setTopClientas(topData);
            setAgendaHoy(agendaData.data);
        } catch {
            setError("Error al cargar el inicio");
        } finally {
            setLoading(false);
        }
    }, []);

    // Usa el mismo endpoint de cambio de estado que la agenda
    const finalizarCita = useCallback(async (id: number): Promise<boolean> => {
        try {
            await cambiarEstadoCita(id, EstadoCita.Finalizada);
            mostrarAlerta("Cita finalizada", "success");
            await cargarDashboard();
            return true;
        } catch (e) {
            const mensaje = e instanceof Error ? e.message : "Algo salió mal";
            mostrarAlerta(mensaje, "error");
            return false;
        }
    }, [cargarDashboard, mostrarAlerta]);

    useEffect(() => {
        cargarDashboard();
    }, [cargarDashboard]);

    return {
        resumen,
        topClientas,
        agendaHoy,
        loading,
        error,
        cargarDashboard,
        finalizarCita,
    };
};

export default useDashboard;

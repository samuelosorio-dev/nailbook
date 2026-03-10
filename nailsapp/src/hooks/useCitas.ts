import { useState, useCallback, useEffect } from "react";
import { getCitas, createCita, updateCita, cambiarEstadoCita } from "../api/citasApi";
import type { CitaResponse, CitaFiltros, CitaRequest } from "../models/cita.model";
import useAlerta from "./useAlerta";

const useCitas = () => {
    const {mostrarAlerta}=useAlerta();
    const [citas, setCitas] = useState<CitaResponse[]>([]);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [paginaActual, setPaginaActual] = useState(1);
    const [filtroEstado, setFiltroEstado] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarCitas = useCallback(async (pagina: number = 1, estado?: number) => {
        setLoading(true);
        setError(null);
        try {
            const filtros: CitaFiltros = {
                pagina,
                recordsPorPagina: 3,
                estado
            };
            const data = await getCitas(filtros);
            setCitas(data.data);
            setTotalRegistros(data.totalRegistros);
            setTotalPaginas(data.totalPaginas);
            setPaginaActual(data.paginaActual);
        } catch (e) {
            setError("Error al cargar las citas: "+e);
        } finally {
            setLoading(false);
        }
    }, []);

    const crearCita = useCallback(async (data: CitaRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await createCita(data);
            await cargarCitas(1, filtroEstado);
            return true;
        } catch (e) {
            const mensaje = e instanceof Error ? e.message : "Algo salió mal";
            mostrarAlerta(mensaje, "error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [cargarCitas, filtroEstado,mostrarAlerta]);

    const editarCita = useCallback(async (id: number, data: CitaRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await updateCita(id, data);
            await cargarCitas(paginaActual, filtroEstado);
            return true;
        } catch (e) {
            const mensaje = e instanceof Error ? e.message : "Algo salió mal";
            mostrarAlerta(mensaje, "error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [cargarCitas, paginaActual, filtroEstado,mostrarAlerta]);

    const cambiarEstado = useCallback(async (id: number, estado: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await cambiarEstadoCita(id, estado);
            await cargarCitas(paginaActual, filtroEstado);
            return true;
        } catch (e) {
            const mensaje = e instanceof Error ? e.message : "Algo salió mal";
            mostrarAlerta(mensaje, "error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [cargarCitas, paginaActual, filtroEstado,mostrarAlerta]);

    const cambiarFiltro = useCallback((estado?: number) => {
        setFiltroEstado(estado);
        cargarCitas(1, estado);
    }, [cargarCitas]);

    useEffect(() => {
        cargarCitas();
    }, [cargarCitas]);

    return {
        citas,
        totalRegistros,
        totalPaginas,
        paginaActual,
        filtroEstado,
        loading,
        error,
        cargarCitas,
        crearCita,
        editarCita,
        cambiarEstado,
        cambiarFiltro,
    };
};

export default useCitas;
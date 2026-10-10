import { useState, useCallback, useEffect } from "react";
import { getServicios, createServicio, updateServicio } from "../api/serviciosApi";
import type { ServicioResponse, ServicioRequest } from "../models/servicio.model";

const useServicios = () => {
    const [servicios, setServicios] = useState<ServicioResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarServicios = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getServicios();
            setServicios(data);
        } catch (e) {
            setError("Error al cargar los servicios: "+e);
        } finally {
            setLoading(false);
        }
    }, []);

    const crearServicio = useCallback(async (data: ServicioRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await createServicio(data);
            await cargarServicios();
            return true;
        } catch (e) {
            setError("Error al crear el servicio: "+e);
            return false;
        } finally {
            setLoading(false);
        }
    }, [cargarServicios]);

    const editarServicio = useCallback(async (id: number, data: ServicioRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await updateServicio(id, data);
            await cargarServicios();
            return true;
        } catch (e) {
            setError("Error al editar el servicio: "+e);
            return false;
        } finally {
            setLoading(false);
        }
    }, [cargarServicios]);

    useEffect(() => {
        cargarServicios();
    }, [cargarServicios]);

    return {
        servicios,
        loading,
        error,
        cargarServicios,
        crearServicio,
        editarServicio,
    };
};

export default useServicios;
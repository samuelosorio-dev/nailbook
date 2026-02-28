import { useState,  useCallback } from "react";
import type { ClienteResponse, ClienteRequest } from "../models/cliente.model";
import { getClientes, searchClientes, createCliente, updateCliente } from "../api/clienteApi";
import { useEffect } from "react";

const useClientes = () => {
    const [clientes, setClientes] = useState<ClienteResponse[]>([]);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [paginaActual, setPaginaActual] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarClientes = useCallback(async (pagina: number = 1) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getClientes(pagina);
            setClientes(data.data);
            setTotalRegistros(data.totalRegistros);
            setTotalPaginas(data.totalPaginas);
            setPaginaActual(data.paginaActual);
        } catch (e) {
            setError("Error al cargar las clientas: "+e);
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarClientes = useCallback(async (termino: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await searchClientes(termino);
            setClientes(data);
            setTotalRegistros(data.length);
            setTotalPaginas(1);
            setPaginaActual(1);
        } catch (e) {
            setError("Error al buscar clientas: "+e);
        } finally {
            setLoading(false);
        }
    }, []);

    const crearCliente = useCallback(async (data: ClienteRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await createCliente(data);
            await cargarClientes(paginaActual);
            return true;
        } catch (e) {
            setError("Error al crear la clienta: "+e);
            return false;
        } finally {
            setLoading(false);
        }
    }, [paginaActual, cargarClientes]);

    const editarCliente = useCallback(async (id: number, data: ClienteRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await updateCliente(id, data);
            await cargarClientes(paginaActual);
            return true;
        } catch (e) {
            setError("Error al editar la clienta: "+e);
            return false;
        } finally {
            setLoading(false);
        }
    }, [paginaActual, cargarClientes]);

    useEffect(() => {
        cargarClientes();
    }, [cargarClientes]);

    return {
        clientes,
        totalRegistros,
        totalPaginas,
        paginaActual,
        loading,
        error,
        cargarClientes,
        buscarClientes,
        crearCliente,
        editarCliente,
    };
};

export default useClientes;
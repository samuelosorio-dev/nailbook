import type { CitaFiltros, CitaResponse, CitaRequest } from "../models/cita.model";
import type { PaginacionResponse } from "../models/cliente.model";
import clienteAPI from "./clienteAxios";

const URL = "/citas";

export const getCitas = async (filtros: CitaFiltros): Promise<PaginacionResponse<CitaResponse>> => {
    const params = new URLSearchParams();
    params.append("pagina", filtros.pagina.toString());
    params.append("recordsPorPagina", filtros.recordsPorPagina.toString());
    if (filtros.estado !== undefined)
        params.append("estado", filtros.estado.toString());

    const response = await clienteAPI.get<PaginacionResponse<CitaResponse>>(
        `${URL}?${params.toString()}`
    );
    return response.data;
};

export const getCitaById = async (id: number): Promise<CitaResponse> => {
    const response = await clienteAPI.get<CitaResponse>(`${URL}/${id}`);
    return response.data;
};

export const createCita = async (data: CitaRequest): Promise<CitaResponse> => {
    const response = await clienteAPI.post<CitaResponse>(URL, data);
    return response.data;
};

export const updateCita = async (id: number, data: CitaRequest): Promise<CitaResponse> => {
    const response = await clienteAPI.put<CitaResponse>(`${URL}/${id}`, data);
    return response.data;
};

export const cambiarEstadoCita = async (id: number, estado: number): Promise<CitaResponse> => {
    const response = await clienteAPI.patch<CitaResponse>(
        `${URL}/${id}/estado?estado=${estado}`
    );
    return response.data;
};
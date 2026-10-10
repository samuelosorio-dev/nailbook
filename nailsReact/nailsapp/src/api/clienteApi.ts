import type { ClienteRequest, ClienteResponse, PaginacionResponse } from "../models/cliente.model";
import clienteAPI from "./clienteAxios";

const URL = "/clientes";

export const getClientes = async (pagina: number = 1, recordsPorPagina: number = 5): Promise<PaginacionResponse<ClienteResponse>> => 
{
    const response = await clienteAPI.get<PaginacionResponse<ClienteResponse>>(
        `${URL}?pagina=${pagina}&recordsPorPagina=${recordsPorPagina}`
    );
    return response.data;
};

export const getClienteById = async (id: number): Promise<ClienteResponse> => {
    const response = await clienteAPI.get<ClienteResponse>(`${URL}/${id}`);
    return response.data;
};

export const searchClientes = async (termino: string): Promise<ClienteResponse[]> => {
    const response = await clienteAPI.get<ClienteResponse[]>(`${URL}/search?termino=${termino}`);
    return response.data;
};

export const createCliente = async (data: ClienteRequest): Promise<ClienteResponse> => {
    const response = await clienteAPI.post<ClienteResponse>(URL, data);
    return response.data;
};

export const updateCliente = async (id: number, data: ClienteRequest): Promise<ClienteResponse> => {
    const response = await clienteAPI.put<ClienteResponse>(`${URL}/${id}`, data);
    return response.data;
};
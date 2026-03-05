import type { ServicioResponse, ServicioRequest } from "../models/servicio.model";
import clienteAPI from "./clienteAxios";

const URL = "/servicios";

export const getServicios = async (): Promise<ServicioResponse[]> => {
    const response = await clienteAPI.get<ServicioResponse[]>(URL);
    return response.data;
};

export const getServicioById = async (id: number): Promise<ServicioResponse> => {
    const response = await clienteAPI.get<ServicioResponse>(`${URL}/${id}`);
    return response.data;
};

export const createServicio = async (data: ServicioRequest): Promise<ServicioResponse> => {
    const response = await clienteAPI.post<ServicioResponse>(URL, data);
    return response.data;
};

export const updateServicio = async (id: number, data: ServicioRequest): Promise<ServicioResponse> => {
    const response = await clienteAPI.put<ServicioResponse>(`${URL}/${id}`, data);
    return response.data;
};
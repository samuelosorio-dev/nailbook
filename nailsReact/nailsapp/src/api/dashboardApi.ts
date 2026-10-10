import type { CitaResponse } from "../models/cita.model";
import type { PaginacionResponse } from "../models/cliente.model";
import type { DashboardResumenDto, TopClientaDto } from "../models/dashboard.model";
import { fechaLocalISO } from "../utils/fechas";
import clienteAPI from "./clienteAxios";

const URL = "/dashboard";

export const getResumen = async (): Promise<DashboardResumenDto> => {
    const response = await clienteAPI.get<DashboardResumenDto>(URL + "/resumen");
    return response.data;
};

export const getTopClientas = async (): Promise<TopClientaDto[]> => {
    const response = await clienteAPI.get<TopClientaDto[]>(URL + "/top-clientas");
    return response.data;
};

export const getAgendaHoy = async (): Promise<PaginacionResponse<CitaResponse>> => {
    const hoy = fechaLocalISO(); // fecha local, no UTC
    const response = await clienteAPI.get<PaginacionResponse<CitaResponse>>(
        `/citas?pagina=1&recordsPorPagina=20&fecha=${hoy}`
    );
    return response.data;
};

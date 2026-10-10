export const EstadoCita = {
    Programada: 1,
    Cancelada: 2,
    Finalizada: 3
} as const;

export type EstadoCita = typeof EstadoCita[keyof typeof EstadoCita];

export interface CitaServicioResponse {
    id: number;
    nombre: string;
    tipo: number;
    valor: number;
    duracion: number;
}

export interface CitaRequest {
    clienteId: number;
    fecha: string;
    horaInicio: string;
    serviciosIds: number[];
}

export interface CitaResponse {
    id: number;
    clienteId: number;
    clienteNombre: string;
    clienteAlias?: string; 
    fecha: string;
    horaInicio: string;
    horaFin: string;
    duracion: number;
    estado: number;
    servicios: CitaServicioResponse[];
}

export interface CitaFiltros {
    estado?: number;
    pagina: number;
    recordsPorPagina: number;
    fecha?: string;
}
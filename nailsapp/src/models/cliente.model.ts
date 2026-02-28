export interface ClienteRequest {
    nombre: string;
    alias?: string;
    telefono: string;
}

export interface ClienteResponse {
    id: number;
    nombre: string;
    alias?: string;
    telefono: string;
}

export interface PaginacionResponse<T> {
    data: T[];
    totalRegistros: number;
    totalPaginas: number;
    paginaActual: number;
}
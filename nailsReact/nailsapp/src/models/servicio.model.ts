export const TipoServicio = {
    Manos: 1,
    Pies: 2
} as const;

export type TipoServicio = typeof TipoServicio[keyof typeof TipoServicio];

export interface ServicioRequest {
    nombre: string;
    valor: number;
    tipo: number;
    duracion: number;
}

export interface ServicioResponse {
    id: number;
    nombre: string;
    valor: number;
    tipo: number;
    duracion: number;
}
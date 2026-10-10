import { EstadoCita } from "../../models/cita.model";

export type VarianteEstado = "programada" | "finalizada" | "cancelada";

export const estadoInfo: Record<number, { label: string; variante: VarianteEstado }> = {
    [EstadoCita.Programada]: { label: "Programada", variante: "programada" },
    [EstadoCita.Finalizada]: { label: "Finalizada", variante: "finalizada" },
    [EstadoCita.Cancelada]: { label: "Cancelada", variante: "cancelada" },
};

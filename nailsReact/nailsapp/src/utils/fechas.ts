// Utilidades de fecha en hora LOCAL.
// Importante: new Date().toISOString() devuelve la fecha en UTC, así que en Colombia
// después de las 7:00 p. m. ya marca el día siguiente. Usa siempre fechaLocalISO().

export const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
export const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
export const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const pad = (n: number) => String(n).padStart(2, "0");

export const fechaLocalISO = (d: Date = new Date()): string =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseFecha = (fecha: string): Date => {
    const [y, m, d] = fecha.split("-").map(Number);
    return new Date(y, m - 1, d);
};

export const sumarDias = (fecha: string, dias: number): string => {
    const d = parseFecha(fecha);
    d.setDate(d.getDate() + dias);
    return fechaLocalISO(d);
};

/** Devuelve los 7 días (lunes a domingo) de la semana que contiene la fecha. */
export const semanaDe = (fecha: string): string[] => {
    const d = parseFecha(fecha);
    const desdeLunes = (d.getDay() + 6) % 7;
    const lunes = sumarDias(fecha, -desdeLunes);
    return Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
};

export const fechaLarga = (d: Date = new Date()): string =>
    `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;

export const mesAnio = (fecha: string): string => {
    const d = parseFecha(fecha);
    return `${MESES[d.getMonth()]} ${d.getFullYear()}`;
};

export const fechaRelativa = (fecha: string): string => {
    const hoy = fechaLocalISO();
    if (fecha === hoy) return "Hoy";
    if (fecha === sumarDias(hoy, -1)) return "Ayer";
    if (fecha === sumarDias(hoy, 1)) return "Mañana";
    const d = parseFecha(fecha);
    return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
};

export const saludo = (): string => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
};

export const horaCorta = (hora: string): string => hora.substring(0, 5);

export const horaActual = (): string => {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const aMinutos = (hora: string): number => {
    const [h, m] = hora.substring(0, 5).split(":").map(Number);
    return h * 60 + m;
};

export const duracionTexto = (min: number): string => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (!h) return `${m} min`;
    return m ? `${h} h ${m} min` : `${h} h`;
};

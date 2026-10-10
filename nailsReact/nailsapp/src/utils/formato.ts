export const formatCOP = (valor: number): string => `$${valor.toLocaleString("es-CO")}`;

export const formatCOPCorto = (valor: number): string => {
    if (valor >= 1_000_000) return `$${(valor / 1_000_000).toFixed(1).replace(".", ",")}M`;
    if (valor >= 1000) return `$${Math.round(valor / 1000)}K`;
    return `$${valor}`;
};

export const iniciales = (nombre: string): string => {
    const partes = nombre.trim().split(/\s+/);
    const primera = partes[0]?.[0] ?? "";
    const segunda = partes[1]?.[0] ?? partes[0]?.[1] ?? "";
    return (primera + segunda).toUpperCase();
};

export const soloDigitos = (telefono: string): string => telefono.replace(/\D/g, "");

/** 3212812991 → 321 281 2991 */
export const formatTelefono = (telefono: string): string => {
    const d = soloDigitos(telefono);
    if (d.length === 10) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
    return telefono;
};

/** Enlace de WhatsApp. Si el número tiene 10 dígitos le agrega el indicativo de Colombia. */
export const enlaceWhatsApp = (telefono: string): string => {
    const d = soloDigitos(telefono);
    const numero = d.length === 10 ? `57${d}` : d;
    return `https://wa.me/${numero}`;
};

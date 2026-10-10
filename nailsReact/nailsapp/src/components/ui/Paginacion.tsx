import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginacionProps {
    paginaActual: number;
    totalPaginas: number;
    onCambiar: (pagina: number) => void;
    disabled?: boolean;
}

const Paginacion = ({ paginaActual, totalPaginas, onCambiar, disabled = false }: PaginacionProps) => {
    if (totalPaginas <= 1) return null;

    const botonBase =
        "w-10 h-10 rounded-xl border border-linea bg-white grid place-items-center text-tinta transition hover:bg-crema disabled:opacity-35 disabled:cursor-not-allowed";

    return (
        <nav aria-label="Paginación" className="flex items-center justify-center gap-3 mt-6">
            <button
                type="button"
                aria-label="Página anterior"
                onClick={() => onCambiar(paginaActual - 1)}
                disabled={paginaActual === 1 || disabled}
                className={botonBase}
            >
                <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-suave">
                Página <strong className="text-tinta">{paginaActual}</strong> de {totalPaginas}
            </span>
            <button
                type="button"
                aria-label="Página siguiente"
                onClick={() => onCambiar(paginaActual + 1)}
                disabled={paginaActual === totalPaginas || disabled}
                className={botonBase}
            >
                <ChevronRight size={18} />
            </button>
        </nav>
    );
};

export default Paginacion;

import type { LucideIcon } from "lucide-react";

export interface OpcionSegmento<T> {
    label: string;
    valor: T;
    contador?: number;
    icon?: LucideIcon;
}

interface SegmentedControlProps<T> {
    opciones: OpcionSegmento<T>[];
    valor: T;
    onChange: (valor: T) => void;
    ariaLabel: string;
}

function SegmentedControl<T>({ opciones, valor, onChange, ariaLabel }: SegmentedControlProps<T>) {
    return (
        <div role="tablist" aria-label={ariaLabel} className="flex gap-0.5 p-1 rounded-xl bg-[#F3E9EC]">
            {opciones.map((opcion) => {
                const activo = opcion.valor === valor;
                const Icon = opcion.icon;
                return (
                    <button
                        key={opcion.label}
                        type="button"
                        role="tab"
                        aria-selected={activo}
                        onClick={() => onChange(opcion.valor)}
                        className={`flex-1 min-w-0 h-9 px-2 rounded-[10px] text-xs flex items-center justify-center gap-1.5 transition-all
                            ${activo
                                ? "bg-white text-tinta font-bold shadow-sm shadow-tinta/10"
                                : "text-suave font-semibold hover:text-tinta"
                            }`}
                    >
                        {Icon && <Icon size={15} strokeWidth={1.9} className="flex-shrink-0" />}
                        <span className="truncate">{opcion.label}</span>
                        {opcion.contador !== undefined && opcion.contador > 0 && (
                            <span
                                className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold grid place-items-center
                                    ${activo ? "bg-baya-600 text-white" : "bg-white/70 text-suave"}`}
                            >
                                {opcion.contador}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default SegmentedControl;

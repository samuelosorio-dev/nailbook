import { createContext, useState, useCallback } from "react";
import { CircleCheck, CircleX, TriangleAlert, type LucideIcon } from "lucide-react";

type TipoAlerta = "success" | "error" | "warning";

interface Alerta {
    mensaje: string;
    tipo: TipoAlerta;
    id: number;
}

export interface AlertaContextType {
    mostrarAlerta: (mensaje: string, tipo?: TipoAlerta) => void;
}

const AlertaContext = createContext<AlertaContextType | null>(null);

const tipoConfig: Record<TipoAlerta, { icon: LucideIcon; iconClass: string }> = {
    success: { icon: CircleCheck, iconClass: "bg-salvia-50 text-salvia-600" },
    error: { icon: CircleX, iconClass: "bg-red-50 text-red-600" },
    warning: { icon: TriangleAlert, iconClass: "bg-amber-50 text-amber-700" },
};

export const AlertaProvider = ({ children }: { children: React.ReactNode }) => {
    const [alertas, setAlertas] = useState<Alerta[]>([]);

    const mostrarAlerta = useCallback((mensaje: string, tipo: TipoAlerta = "success") => {
        const id = Date.now() + Math.random();
        setAlertas((prev) => [...prev, { mensaje, tipo, id }]);
        setTimeout(() => {
            setAlertas((prev) => prev.filter((a) => a.id !== id));
        }, 3500);
    }, []);

    return (
        <AlertaContext.Provider value={{ mostrarAlerta }}>
            {children}

            {/* Toasts */}
            <div
                aria-live="polite"
                className="fixed top-4 inset-x-4 z-[70] flex flex-col items-center gap-2 pointer-events-none"
            >
                {alertas.map((alerta) => {
                    const config = tipoConfig[alerta.tipo];
                    const Icon = config.icon;
                    return (
                        <div
                            key={alerta.id}
                            className="w-full max-w-md flex items-center gap-3 pl-3 pr-4 py-3 rounded-2xl bg-white border border-linea
                                shadow-lg shadow-tinta/10 animate-fade-in"
                        >
                            <div className={`w-9 h-9 rounded-xl grid place-items-center flex-shrink-0 ${config.iconClass}`}>
                                <Icon size={20} strokeWidth={1.8} />
                            </div>
                            <p className="text-sm font-medium text-tinta">{alerta.mensaje}</p>
                        </div>
                    );
                })}
            </div>
        </AlertaContext.Provider>
    );
};

export default AlertaContext;

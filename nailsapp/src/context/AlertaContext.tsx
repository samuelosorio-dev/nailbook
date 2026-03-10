import { createContext, useState, useCallback } from "react";

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

export const AlertaProvider = ({ children }: { children: React.ReactNode }) => {
    const [alertas, setAlertas] = useState<Alerta[]>([]);

    const mostrarAlerta = useCallback((mensaje: string, tipo: TipoAlerta = "success") => {
        const id = Date.now();
        setAlertas(prev => [...prev, { mensaje, tipo, id }]);
        setTimeout(() => {
            setAlertas(prev => prev.filter(a => a.id !== id));
        }, 3500);
    }, []);

    const tipoConfig = {
        success: {
            bg: "bg-white border-l-4 border-emerald-400",
            icon: "✓",
            iconClass: "bg-emerald-400",
            textClass: "text-gray-700"
        },
        error: {
            bg: "bg-white border-l-4 border-rose-400",
            icon: "✕",
            iconClass: "bg-rose-400",
            textClass: "text-gray-700"
        },
        warning: {
            bg: "bg-white border-l-4 border-amber-400",
            icon: "!",
            iconClass: "bg-amber-400",
            textClass: "text-gray-700"
        },
    };

    return (
        <AlertaContext.Provider value={{ mostrarAlerta }}>
            {children}

            {/* Toasts */}
            <div className="fixed top-5 right-4 left-4 z-50 flex flex-col gap-2 pointer-events-none">
                {alertas.map(alerta => {
                    const config = tipoConfig[alerta.tipo];
                    return (
                        <div
                            key={alerta.id}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg ${config.bg} animate-fade-in`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${config.iconClass}`}>
                                {config.icon}
                            </div>
                            <p className={`text-sm font-medium ${config.textClass}`}>
                                {alerta.mensaje}
                            </p>
                        </div>
                    );
                })}
            </div>
        </AlertaContext.Provider>
    );
};

export default AlertaContext;


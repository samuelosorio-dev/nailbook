import { useContext } from "react";
import AlertaContext, { type AlertaContextType } from "../context/AlertaContext";

const useAlerta = (): AlertaContextType => {
    const context = useContext(AlertaContext);
    if (!context)
        throw new Error("useAlerta debe usarse dentro de AlertaProvider");
    return context;
};

export default useAlerta;
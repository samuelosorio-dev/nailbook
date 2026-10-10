import { useEffect } from "react";
import { CircleCheck, CircleX } from "lucide-react";

interface ConfirmDialogProps {
    titulo: string;
    mensaje: string;
    textoConfirmar: string;
    tono: "peligro" | "exito";
    onConfirmar: () => void;
    onCancelar: () => void;
}

const ConfirmDialog = ({ titulo, mensaje, textoConfirmar, tono, onConfirmar, onCancelar }: ConfirmDialogProps) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancelar();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onCancelar]);

    const Icon = tono === "peligro" ? CircleX : CircleCheck;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <div aria-hidden="true" onClick={onCancelar} className="absolute inset-0 bg-tinta/45 animate-fade" />
            <div
                role="alertdialog"
                aria-modal="true"
                className="relative w-full max-w-sm bg-white rounded-[24px] p-6 shadow-2xl animate-fade-in"
            >
                <div
                    className={`w-12 h-12 rounded-2xl grid place-items-center mx-auto mb-4
                        ${tono === "peligro" ? "bg-red-50 text-red-600" : "bg-salvia-50 text-salvia-600"}`}
                >
                    <Icon size={24} strokeWidth={1.8} />
                </div>
                <p className="font-display text-xl font-medium text-center">{titulo}</p>
                <p className="text-sm text-suave text-center mt-1.5 mb-6">{mensaje}</p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancelar}
                        className="flex-1 h-11 rounded-xl border border-linea text-sm font-semibold text-tinta hover:bg-crema transition"
                    >
                        No, volver
                    </button>
                    <button
                        type="button"
                        onClick={onConfirmar}
                        className={`flex-1 h-11 rounded-xl text-sm font-bold text-white transition
                            ${tono === "peligro" ? "bg-red-600 hover:bg-red-700" : "bg-salvia-600 hover:bg-salvia-700"}`}
                    >
                        {textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;

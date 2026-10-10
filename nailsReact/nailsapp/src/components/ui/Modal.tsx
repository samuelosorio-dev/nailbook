import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import IconButton from "./IconButton";

interface ModalProps {
    title: string;
    subtitle?: string;
    onClose: () => void;
    children: React.ReactNode;
}

/**
 * En celular se comporta como hoja inferior (sube desde abajo).
 * Desde tablet (md) es un diálogo centrado.
 */
const Modal = ({ title, subtitle, onClose, children }: ModalProps) => {
    const tituloId = useId();
    const onCloseRef = useRef(onClose);

    // Mantener el ref actualizado sin escribirlo durante el render (React 19)
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCloseRef.current();
        };
        document.addEventListener("keydown", onKey);
        const overflowPrevio = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = overflowPrevio;
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6">
            <div
                aria-hidden="true"
                onClick={onClose}
                className="absolute inset-0 bg-tinta/45 backdrop-blur-[2px] animate-fade"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={tituloId}
                className="relative w-full md:max-w-lg bg-white rounded-t-[28px] md:rounded-[28px] shadow-2xl
                    flex flex-col max-h-[92dvh] md:max-h-[88vh] animate-slide-up md:animate-fade-in"
            >
                <div className="flex justify-center pt-2.5 md:hidden">
                    <span className="h-1.5 w-10 rounded-full bg-[#E3D3D9]" />
                </div>

                <header className="flex items-start justify-between gap-4 px-5 md:px-7 pt-3 md:pt-6 pb-3 flex-shrink-0">
                    <div className="min-w-0">
                        {subtitle && <p className="text-xs font-semibold text-suave">{subtitle}</p>}
                        <h2 id={tituloId} className="font-display text-2xl font-medium tracking-tight leading-tight">
                            {title}
                        </h2>
                    </div>
                    <IconButton icon={X} label="Cerrar" onClick={onClose} />
                </header>

                <div className="overflow-y-auto px-5 md:px-7 pb-safe md:pb-6">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
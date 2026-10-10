import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    titulo: string;
    descripcion?: string;
    accion?: React.ReactNode;
}

const EmptyState = ({ icon: Icon, titulo, descripcion, accion }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center text-center py-12 px-6">
            <div className="w-14 h-14 rounded-2xl bg-baya-50 text-baya-600 grid place-items-center mb-4">
                <Icon size={26} strokeWidth={1.6} />
            </div>
            <p className="font-display text-lg font-medium">{titulo}</p>
            {descripcion && <p className="text-sm text-suave mt-1 max-w-xs">{descripcion}</p>}
            {accion && <div className="mt-5">{accion}</div>}
        </div>
    );
};

export default EmptyState;

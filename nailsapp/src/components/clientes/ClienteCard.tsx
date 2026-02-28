import type { ClienteResponse } from "../../models/cliente.model";
import Card from "../ui/Card";

interface ClienteCardProps {
    cliente: ClienteResponse;
    onEdit: (cliente: ClienteResponse) => void;
}

const ClienteCard = ({ cliente, onEdit }: ClienteCardProps) => {
    return (
        <Card>
            <div className="flex items-center gap-4">
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #f43f5e, #a855f7)" }}
                >
                    {cliente.nombre[0].toUpperCase()}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{cliente.nombre}</span>
                        {cliente.alias && (
                            <span className="text-xs bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full">
                                @{cliente.alias}
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-gray-400">{cliente.telefono}</div>
                </div>
                <button
                    onClick={() => onEdit(cliente)}
                    className="w-8 h-8 rounded-full border border-rose-100 flex items-center justify-center text-rose-400 hover:bg-rose-50 transition-all"
                >
                    ✎
                </button>
            </div>
        </Card>
    );
};

export default ClienteCard;
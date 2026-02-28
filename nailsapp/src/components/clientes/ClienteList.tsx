import type { ClienteResponse } from "../../models/cliente.model";
import ClienteCard from "./ClienteCard";

interface ClienteListProps {
    clientes: ClienteResponse[];
    onEdit: (cliente: ClienteResponse) => void;
    loading?: boolean;
}

const ClienteList = ({ clientes, onEdit, loading = false }: ClienteListProps) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 rounded-full border-2 border-rose-300 border-t-rose-500 animate-spin" />
            </div>
        );
    }

    if (clientes.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-4xl mb-3">✦</div>
                <p className="text-gray-400 text-sm">No hay clientas registradas aún</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {clientes.map((cliente) => (
                <ClienteCard
                    key={cliente.id}
                    cliente={cliente}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};

export default ClienteList;
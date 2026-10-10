import { SearchX, Users } from "lucide-react";
import type { ClienteResponse } from "../../models/cliente.model";
import EmptyState from "../ui/EmptyState";
import Skeleton from "../ui/Skeleton";
import ClienteCard from "./ClienteCard";

interface ClienteListProps {
    clientes: ClienteResponse[];
    onEdit: (cliente: ClienteResponse) => void;
    loading?: boolean;
    buscando?: boolean;
}

const ClienteList = ({ clientes, onEdit, loading = false, buscando = false }: ClienteListProps) => {
    if (loading) {
        return (
            <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-[68px] rounded-[20px]" />)}
            </div>
        );
    }

    if (clientes.length === 0) {
        return buscando ? (
            <EmptyState icon={SearchX} titulo="Sin resultados" descripcion="Prueba con otro nombre, alias o teléfono." />
        ) : (
            <EmptyState icon={Users} titulo="Aún no hay clientas" descripcion="Registra tu primera clienta para empezar a agendar." />
        );
    }

    // Agrupa por letra inicial, en orden alfabético
    const grupos = [...clientes]
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
        .reduce<Record<string, ClienteResponse[]>>((acc, cliente) => {
            const letra = cliente.nombre.trim().charAt(0).toUpperCase() || "#";
            if (!acc[letra]) acc[letra] = [];
            acc[letra].push(cliente);
            return acc;
        }, {});

    return (
        <div className="flex flex-col gap-4">
            {Object.entries(grupos).map(([letra, lista]) => (
                <section key={letra} aria-label={`Clientas con ${letra}`}>
                    <p className="font-display italic text-[15px] text-baya-600 mb-1.5 ml-1">{letra}</p>
                    <div className="bg-white border border-linea rounded-[20px] divide-y divide-[#F3E9EC] overflow-hidden">
                        {lista.map((cliente) => (
                            <ClienteCard key={cliente.id} cliente={cliente} onEdit={onEdit} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default ClienteList;

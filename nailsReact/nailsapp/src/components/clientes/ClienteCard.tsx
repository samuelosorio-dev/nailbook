import { MessageCircle, Pencil } from "lucide-react";
import type { ClienteResponse } from "../../models/cliente.model";
import { enlaceWhatsApp, formatTelefono } from "../../utils/formato";
import Avatar from "../ui/Avatar";
import IconButton from "../ui/IconButton";

interface ClienteCardProps {
    cliente: ClienteResponse;
    onEdit: (cliente: ClienteResponse) => void;
}

/** Fila de clienta. Se agrupa dentro de una tarjeta por letra en ClienteList. */
const ClienteCard = ({ cliente, onEdit }: ClienteCardProps) => {
    return (
        <div className="flex items-center gap-3 py-3 pl-3.5 pr-2.5">
            <Avatar nombre={cliente.nombre} semilla={cliente.id} />
            <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold truncate">
                    {cliente.nombre}
                    {cliente.alias && (
                        <span className="text-xs font-semibold text-baya-600 ml-1.5">@{cliente.alias}</span>
                    )}
                </p>
                <p className="text-xs text-suave">{formatTelefono(cliente.telefono)}</p>
            </div>
            <div className="flex items-center gap-1">
                <IconButton
                    icon={MessageCircle}
                    label={`Escribir a ${cliente.nombre} por WhatsApp`}
                    href={enlaceWhatsApp(cliente.telefono)}
                    variant="soft"
                />
                <IconButton
                    icon={Pencil}
                    label={`Editar a ${cliente.nombre}`}
                    onClick={() => onEdit(cliente)}
                    variant="ghost"
                />
            </div>
        </div>
    );
};

export default ClienteCard;

import { Users } from "lucide-react";
import type { TopClientaDto } from "../../models/dashboard.model";
import { formatCOP } from "../../utils/formato";
import Avatar from "../ui/Avatar";
import Skeleton from "../ui/Skeleton";

interface TopClientasProps {
    clientas: TopClientaDto[];
    loading: boolean;
}

const TopClientas = ({ clientas, loading }: TopClientasProps) => {
    return (
        <section className="bg-white border border-linea rounded-[22px] p-5">
            <h2 className="font-display text-[19px] font-semibold mb-3">Clientas del año</h2>

            {loading ? (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-11" />)}
                </div>
            ) : clientas.length === 0 ? (
                <div className="flex flex-col items-center text-center py-6">
                    <Users size={26} strokeWidth={1.6} className="text-baya-400 mb-2" />
                    <p className="text-sm text-suave">Todavía no hay datos este año</p>
                </div>
            ) : (
                <ol className="flex flex-col gap-3">
                    {clientas.map((c, i) => (
                        <li key={c.clienteId} className="flex items-center gap-3">
                            <span
                                className={`font-display italic text-lg w-5 text-center ${i === 0 ? "text-baya-600" : "text-suave"}`}
                            >
                                {i + 1}
                            </span>
                            <Avatar nombre={c.nombre} semilla={c.clienteId} tamano="sm" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">
                                    {c.nombre}
                                    {c.alias && <span className="text-xs font-semibold text-baya-600 ml-1.5">@{c.alias}</span>}
                                </p>
                                <p className="text-xs text-suave">
                                    {c.totalCitas} cita{c.totalCitas === 1 ? "" : "s"}
                                </p>
                            </div>
                            <p className="text-sm font-bold">{formatCOP(c.totalIngresos)}</p>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
};

export default TopClientas;

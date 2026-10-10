import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Footprints, Hand, Search, UserRound } from "lucide-react";
import { searchClientes } from "../../api/clienteApi";
import type { CitaRequest, CitaResponse } from "../../models/cita.model";
import type { ClienteResponse } from "../../models/cliente.model";
import { TipoServicio, type ServicioResponse } from "../../models/servicio.model";
import { duracionTexto, fechaLocalISO } from "../../utils/fechas";
import { formatCOP, formatTelefono } from "../../utils/formato";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import SegmentedControl from "../ui/SegmentedControl";

interface CitaFormProps {
    onSubmit: (data: CitaRequest) => void;
    onCancel: () => void;
    citaEditar?: CitaResponse | null;
    loading?: boolean;
    servicios: ServicioResponse[];
}

const HORAS = [
    "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00",
];

const PASOS = ["Clienta", "Servicios", "Fecha y hora"];

const CitaForm = ({ onSubmit, onCancel, citaEditar, loading = false, servicios }: CitaFormProps) => {
    const editando = !!citaEditar;
    const [paso, setPaso] = useState(1);
    const [clienteId, setClienteId] = useState<number | null>(null);
    const [clienteNombre, setClienteNombre] = useState("");
    const [clienteAlias, setClienteAlias] = useState<string | undefined>(undefined);
    const [busquedaCliente, setBusquedaCliente] = useState("");
    const [resultadosClientes, setResultadosClientes] = useState<ClienteResponse[]>([]);
    const [buscandoCliente, setBuscandoCliente] = useState(false);
    const [fecha, setFecha] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<number[]>([]);
    const [tipoVisible, setTipoVisible] = useState<number>(TipoServicio.Manos);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const seleccionados = servicios.filter((s) => serviciosSeleccionados.includes(s.id));
    const duracionTotal = seleccionados.reduce((acc, s) => acc + s.duracion, 0);
    const valorTotal = seleccionados.reduce((acc, s) => acc + s.valor, 0);
    const serviciosVisibles = servicios.filter((s) => s.tipo === tipoVisible);
    const contarSeleccionados = (tipo: number) => seleccionados.filter((s) => s.tipo === tipo).length;

    // Rellenar al editar (empieza en el paso 2)
    useEffect(() => {
        if (!citaEditar) return;
        setClienteId(citaEditar.clienteId);
        setClienteNombre(citaEditar.clienteNombre);
        setClienteAlias(citaEditar.clienteAlias);
        setBusquedaCliente(citaEditar.clienteNombre);
        setFecha(citaEditar.fecha);
        setHoraInicio(citaEditar.horaInicio.substring(0, 5));
        setServiciosSeleccionados(citaEditar.servicios.map((s) => s.id));
        setPaso(2);
    }, [citaEditar]);

    // Debounce búsqueda clientas
    useEffect(() => {
        if (!busquedaCliente.trim() || busquedaCliente === clienteNombre) {
            setResultadosClientes([]);
            setBuscandoCliente(false);
            return;
        }

        setBuscandoCliente(true);
        const timeout = setTimeout(async () => {
            try {
                const resultados = await searchClientes(busquedaCliente);
                setResultadosClientes(resultados);
            } finally {
                setBuscandoCliente(false);
            }
        }, 600);
        return () => clearTimeout(timeout);
    }, [busquedaCliente, clienteNombre]);

    const seleccionarCliente = (cliente: ClienteResponse) => {
        setClienteId(cliente.id);
        setClienteNombre(cliente.nombre);
        setClienteAlias(cliente.alias);
        setBusquedaCliente(cliente.nombre);
        setResultadosClientes([]);
        setErrors({});
    };

    const cambiarCliente = () => {
        setClienteId(null);
        setClienteNombre("");
        setClienteAlias(undefined);
        setBusquedaCliente("");
    };

    const toggleServicio = (id: number) => {
        setServiciosSeleccionados((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
        setErrors({});
    };

    const siguientePaso = () => {
        const newErrors: Record<string, string> = {};
        if (paso === 1 && !clienteId) newErrors.cliente = "Selecciona una clienta para continuar";
        if (paso === 2 && serviciosSeleccionados.length === 0) newErrors.servicios = "Selecciona al menos un servicio";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        setPaso((p) => p + 1);
    };

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};
        if (!fecha) newErrors.fecha = "La fecha es obligatoria";
        if (!horaInicio) newErrors.horaInicio = "La hora es obligatoria";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSubmit({
            clienteId: clienteId!,
            fecha,
            horaInicio,
            serviciosIds: serviciosSeleccionados,
        });
    };

    return (
        <div className="flex flex-col">
            {/* Progreso */}
            <div className="grid grid-cols-3 gap-1.5 mb-5" aria-label={`Paso ${paso} de 3`}>
                {PASOS.map((label, i) => {
                    const numero = i + 1;
                    const completo = paso >= numero;
                    return (
                        <div key={label}>
                            <div className={`h-1 rounded-full transition-colors ${completo ? "bg-baya-600" : "bg-linea"}`} />
                            <p
                                className={`text-[11px] mt-1.5 ${paso === numero ? "font-bold text-baya-600" : completo ? "font-semibold text-suave" : "font-semibold text-tenue"}`}
                            >
                                {label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Paso 1 — Clienta */}
            {paso === 1 && (
                <div className="flex flex-col gap-3 min-h-[280px]">
                    {clienteId !== null && resultadosClientes.length === 0 ? (
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-baya-50 border border-baya-200">
                            <Avatar nombre={clienteNombre} semilla={clienteId} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">
                                    {clienteNombre}
                                    {clienteAlias && <span className="text-xs font-semibold text-baya-600 ml-1.5">@{clienteAlias}</span>}
                                </p>
                                <p className="text-xs text-suave">Clienta seleccionada</p>
                            </div>
                            <Button label="Cambiar" variant="ghost" size="sm" onClick={cambiarCliente} />
                        </div>
                    ) : (
                        <>
                            <label className="flex items-center gap-2.5 h-12 px-3.5 rounded-xl border border-linea bg-white focus-within:border-baya-300 focus-within:ring-4 focus-within:ring-baya-50 transition">
                                <Search size={18} strokeWidth={1.8} className="text-suave" />
                                <span className="sr-only">Buscar clienta</span>
                                <input
                                    autoFocus
                                    value={busquedaCliente}
                                    onChange={(e) => {
                                        setBusquedaCliente(e.target.value);
                                        setClienteId(null);
                                    }}
                                    placeholder="Nombre, alias o teléfono"
                                    className="flex-1 min-w-0 bg-transparent text-sm focus:outline-none placeholder:text-tenue"
                                />
                            </label>

                            {buscandoCliente ? (
                                <p className="text-xs text-suave px-1">Buscando…</p>
                            ) : resultadosClientes.length > 0 ? (
                                <ul className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                                    {resultadosClientes.map((cliente) => (
                                        <li key={cliente.id}>
                                            <button
                                                type="button"
                                                onClick={() => seleccionarCliente(cliente)}
                                                className="w-full flex items-center gap-3 p-2.5 rounded-2xl border border-linea text-left hover:bg-crema transition"
                                            >
                                                <Avatar nombre={cliente.nombre} semilla={cliente.id} tamano="sm" />
                                                <span className="flex-1 min-w-0">
                                                    <span className="block text-sm font-bold truncate">
                                                        {cliente.nombre}
                                                        {cliente.alias && (
                                                            <span className="text-xs font-semibold text-baya-600 ml-1.5">@{cliente.alias}</span>
                                                        )}
                                                    </span>
                                                    <span className="block text-xs text-suave">{formatTelefono(cliente.telefono)}</span>
                                                </span>
                                                <ChevronRight size={16} className="text-suave" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : busquedaCliente.trim() ? (
                                <p className="text-xs text-suave px-1">
                                    No hay clientas que coincidan con “{busquedaCliente}”.
                                </p>
                            ) : (
                                <div className="flex flex-col items-center text-center py-8 text-suave">
                                    <UserRound size={26} strokeWidth={1.6} className="text-baya-400 mb-2" />
                                    <p className="text-sm">Escribe para buscar una clienta registrada</p>
                                </div>
                            )}
                        </>
                    )}
                    {errors.cliente && <p className="text-xs font-medium text-red-600 px-1">{errors.cliente}</p>}
                </div>
            )}

            {/* Paso 2 — Servicios */}
            {paso === 2 && (
                <div className="flex flex-col gap-3 min-h-[280px]">
                    {editando && (
                        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-crema">
                            <Avatar nombre={clienteNombre} semilla={clienteId ?? undefined} tamano="sm" />
                            <p className="text-sm font-bold truncate">
                                {clienteNombre}
                                {clienteAlias && <span className="text-xs font-semibold text-baya-600 ml-1.5">@{clienteAlias}</span>}
                            </p>
                        </div>
                    )}

                    <SegmentedControl
                        ariaLabel="Tipo de servicio"
                        valor={tipoVisible}
                        onChange={setTipoVisible}
                        opciones={[
                            { label: "Manos", valor: TipoServicio.Manos, icon: Hand, contador: contarSeleccionados(TipoServicio.Manos) },
                            { label: "Pies", valor: TipoServicio.Pies, icon: Footprints, contador: contarSeleccionados(TipoServicio.Pies) },
                        ]}
                    />

                    <ul className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                        {serviciosVisibles.length === 0 && (
                            <li className="text-sm text-suave text-center py-6">No hay servicios de este tipo</li>
                        )}
                        {serviciosVisibles.map((servicio) => {
                            const seleccionado = serviciosSeleccionados.includes(servicio.id);
                            return (
                                <li key={servicio.id}>
                                    <label
                                        className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl cursor-pointer transition
                                            ${seleccionado ? "border-[1.5px] border-baya-600 bg-baya-50" : "border border-linea hover:bg-crema"}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={seleccionado}
                                            onChange={() => toggleServicio(servicio.id)}
                                            className="w-5 h-5 m-0 accent-[#8C2F55]"
                                        />
                                        <span className="flex-1 min-w-0">
                                            <span className={`block text-sm truncate ${seleccionado ? "font-bold" : "font-semibold"}`}>
                                                {servicio.nombre}
                                            </span>
                                            <span className="block text-xs text-suave">{servicio.duracion} min</span>
                                        </span>
                                        <span className={`text-sm ${seleccionado ? "font-bold" : "font-semibold"}`}>
                                            {formatCOP(servicio.valor)}
                                        </span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                    {errors.servicios && <p className="text-xs font-medium text-red-600 px-1">{errors.servicios}</p>}
                </div>
            )}

            {/* Paso 3 — Fecha & Hora */}
            {paso === 3 && (
                <div className="flex flex-col gap-5 min-h-[280px]">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="cita-fecha" className="text-[13px] font-semibold">Fecha</label>
                        <input
                            id="cita-fecha"
                            type="date"
                            value={fecha}
                            onChange={(e) => {
                                setFecha(e.target.value);
                                setErrors({});
                            }}
                            min={fechaLocalISO()}
                            className="h-12 px-3.5 rounded-xl border border-linea bg-white text-sm focus:outline-none focus:border-baya-300 focus:ring-4 focus:ring-baya-50"
                        />
                        {errors.fecha && <p className="text-xs font-medium text-red-600">{errors.fecha}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="cita-hora" className="text-[13px] font-semibold">Hora de inicio</label>
                        <input
                            id="cita-hora"
                            type="time"
                            value={horaInicio}
                            onChange={(e) => {
                                setHoraInicio(e.target.value);
                                setErrors({});
                            }}
                            className="h-12 px-3.5 rounded-xl border border-linea bg-white text-sm focus:outline-none focus:border-baya-300 focus:ring-4 focus:ring-baya-50"
                        />
                        <p className="text-xs text-suave mt-1">Horas frecuentes</p>
                        <div className="grid grid-cols-4 gap-2">
                            {HORAS.map((hora) => {
                                const activa = horaInicio === hora;
                                return (
                                    <button
                                        key={hora}
                                        type="button"
                                        aria-pressed={activa}
                                        onClick={() => {
                                            setHoraInicio(hora);
                                            setErrors({});
                                        }}
                                        className={`h-10 rounded-xl text-sm font-semibold transition
                                            ${activa ? "bg-baya-600 text-white" : "bg-crema text-tinta hover:bg-baya-50"}`}
                                    >
                                        {hora}
                                    </button>
                                );
                            })}
                        </div>
                        {errors.horaInicio && <p className="text-xs font-medium text-red-600">{errors.horaInicio}</p>}
                    </div>
                </div>
            )}

            {/* Pie fijo con resumen y acciones */}
            <div className="sticky bottom-0 bg-white border-t border-linea -mx-5 md:-mx-7 px-5 md:px-7 pt-4 mt-5 flex flex-col gap-3">
                {serviciosSeleccionados.length > 0 && paso >= 2 && (
                    <div className="flex items-end justify-between">
                        <p className="text-xs text-suave">
                            {serviciosSeleccionados.length} servicio{serviciosSeleccionados.length === 1 ? "" : "s"} · {duracionTexto(duracionTotal)}
                        </p>
                        <p className="font-display text-xl font-semibold leading-none">{formatCOP(valorTotal)}</p>
                    </div>
                )}
                <div className="flex gap-3">
                    {paso > 1 ? (
                        <Button
                            label="Atrás"
                            icon={ChevronLeft}
                            variant="secondary"
                            onClick={() => setPaso((p) => p - 1)}
                            disabled={editando && paso === 2}
                            fullWidth
                        />
                    ) : (
                        <Button label="Cancelar" variant="secondary" onClick={onCancel} fullWidth />
                    )}
                    {paso < 3 ? (
                        <Button label="Continuar" iconRight={ChevronRight} onClick={siguientePaso} fullWidth />
                    ) : (
                        <Button
                            label={loading ? "Guardando…" : editando ? "Actualizar cita" : "Confirmar cita"}
                            icon={Check}
                            onClick={handleSubmit}
                            disabled={loading}
                            fullWidth
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CitaForm;

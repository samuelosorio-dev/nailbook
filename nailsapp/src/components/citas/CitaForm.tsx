import { useEffect, useState } from "react";
import { searchClientes } from "../../api/clienteApi";
import type { CitaRequest, CitaResponse } from "../../models/cita.model";
import type { ClienteResponse } from "../../models/cliente.model";
import { type ServicioResponse } from "../../models/servicio.model";
import Button from "../ui/Button";

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
    "16:00", "17:00", "18:00", "19:00"
];

const CitaForm = ({
    onSubmit,
    onCancel,
    citaEditar,
    loading = false,
    servicios,
}: CitaFormProps) => {
    const [paso, setPaso] = useState(1);
    const [clienteId, setClienteId] = useState<number | null>(null);
    const [clienteNombre, setClienteNombre] = useState("");
    const [busquedaCliente, setBusquedaCliente] = useState("");
    const [resultadosClientes, setResultadosClientes] = useState<ClienteResponse[]>([]);
    const [buscandoCliente, setBuscandoCliente] = useState(false);
    const [fecha, setFecha] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<number[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const duracionTotal = servicios
        .filter(s => serviciosSeleccionados.includes(s.id))
        .reduce((acc, s) => acc + s.duracion, 0);

    const valorTotal = servicios
        .filter(s => serviciosSeleccionados.includes(s.id))
        .reduce((acc, s) => acc + s.valor, 0);

    // Rellenar al editar
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!citaEditar) return;
        setClienteId(citaEditar.clienteId);
        setClienteNombre(citaEditar.clienteNombre);
        setBusquedaCliente(citaEditar.clienteNombre);
        setFecha(citaEditar.fecha);
        setHoraInicio(citaEditar.horaInicio.substring(0, 5));
        setServiciosSeleccionados(citaEditar.servicios.map(s => s.id));
        setPaso(citaEditar ? 2 : 1); // ← al editar empieza en paso 2
    }, [citaEditar]);

    // Debounce búsqueda clientas
    useEffect(() => {
        if (!busquedaCliente.trim() || busquedaCliente === clienteNombre) {
            setResultadosClientes([]);
            return;
        }
        const timeout = setTimeout(async () => {
            setBuscandoCliente(true);
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
        setBusquedaCliente(cliente.nombre);
        setResultadosClientes([]);
    };

    const toggleServicio = (id: number) => {
        setServiciosSeleccionados(prev =>
            prev.includes(id)
                ? prev.filter(s => s !== id)
                : [...prev, id]
        );
    };

    const siguientePaso = () => {
        const newErrors: Record<string, string> = {};
        if (paso === 1 && !clienteId)
            newErrors.cliente = "Debe seleccionar una clienta";
        if (paso === 2 && serviciosSeleccionados.length === 0)
            newErrors.servicios = "Debe seleccionar al menos un servicio";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        setPaso(p => p + 1);
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

    // Stepper header
    const pasos = [
        { numero: 1, label: "Clienta" },
        { numero: 2, label: "Servicios" },
        { numero: 3, label: "Fecha & Hora" },
    ];

    return (
        <div className="flex flex-col gap-4">

            {/* Stepper */}
            <div className="flex items-center justify-between mb-2">
                {pasos.map((p, index) => (
                    <div key={p.numero} className="flex items-center">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                    ${paso > p.numero
                                        ? "text-white"
                                        : paso === p.numero
                                            ? "text-white"
                                            : "border-2 border-gray-200 text-gray-300"
                                    }`}
                                style={paso >= p.numero ? {
                                    background: "linear-gradient(135deg, #f43f5e, #a855f7)"
                                } : {}}
                            >
                                {paso > p.numero ? "✓" : p.numero}
                            </div>
                            <span className={`text-xs font-medium ${
                                paso === p.numero ? "text-rose-500" : "text-gray-300"
                            }`}>
                                {p.label}
                            </span>
                        </div>
                        {index < pasos.length - 1 && (
                            <div className={`h-px w-8 mx-2 ${
                                paso > p.numero ? "bg-rose-300" : "bg-gray-200"
                            }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Paso 1 — Clienta */}
            {paso === 1 && (
                <div className="flex flex-col gap-3">
                    <p className="text-sm text-gray-500">
                        Selecciona o busca una clienta registrada
                    </p>
                    <input
                        value={busquedaCliente}
                        onChange={(e) => {
                            setBusquedaCliente(e.target.value);
                            setClienteId(null);
                        }}
                        placeholder="Buscar clienta..."
                        className="w-full border border-rose-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 bg-rose-50/30"
                    />
                    {buscandoCliente && (
                        <p className="text-xs text-gray-400 px-1">Buscando...</p>
                    )}
                    {resultadosClientes.length > 0 && (
                        <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
                            {resultadosClientes.map(cliente => (
                                <button
                                    key={cliente.id}
                                    type="button"
                                    onClick={() => {
                                        seleccionarCliente(cliente)
                                        setErrors({})
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all
                                        ${clienteId === cliente.id
                                            ? "border-transparent text-white"
                                            : "border-rose-100 hover:bg-rose-50"
                                        }`}
                                    style={clienteId === cliente.id ? {
                                        background: "linear-gradient(135deg, #f43f5e, #a855f7)"
                                    } : {}}
                                >
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                        style={{ background: "linear-gradient(135deg, #f43f5e, #a855f7)" }}
                                    >
                                        {cliente.nombre[0].toUpperCase()}
                                        
                                    </div>
                                    <div>                                        
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm font-medium ${clienteId === cliente.id ? "text-white" : "text-gray-700"}`}>
                                            {cliente.nombre}
                                            </p>
                                            {cliente.alias && (
                                            <span className="text-xs bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full">
                                                @{cliente.alias}
                                            </span>
                                            )}
                                        </div>
                                        <p className={`text-xs ${clienteId === cliente.id ? "text-white/80" : "text-gray-400"}`}>
                                            {cliente.telefono}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                    {errors.cliente && (
                        <p className="text-xs text-rose-400 px-1">{errors.cliente}</p>
                    )}
                </div>
            )}

            {/* Paso 2 — Servicios */}
            {paso === 2 && (
                <div className="flex flex-col gap-3">
                    <p className="text-sm text-gray-500">
                        Puedes seleccionar uno o varios servicios
                    </p>
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                        {servicios.map(servicio => {
                            const seleccionado = serviciosSeleccionados.includes(servicio.id);
                            const esManos = servicio.tipo === 1;
                            return (
                                <button
                                    key={servicio.id}
                                    type="button"
                                    onClick={() => {
                                        toggleServicio(servicio.id)
                                        setErrors({})
                                    }}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-sm transition-all
                                        ${seleccionado
                                            ? "border-violet-200 bg-violet-50"
                                            : "border-gray-100 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="text-left">
                                        <p className="font-medium text-gray-700">{servicio.nombre}</p>
                                        <p className="text-xs text-gray-400">
                                            {esManos ? "Manos" : "Pies"} · {servicio.duracion} min
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-rose-500">
                                            ${servicio.valor.toLocaleString("es-CO")}
                                        </span>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                            ${seleccionado
                                                ? "border-transparent text-white"
                                                : "border-gray-300"
                                            }`}
                                            style={seleccionado ? {
                                                background: "linear-gradient(135deg, #f43f5e, #a855f7)"
                                            } : {}}
                                        >
                                            {seleccionado && <span className="text-xs">✓</span>}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Totales */}
                    {serviciosSeleccionados.length > 0 && (
                        <div className="border-t border-rose-50 pt-3 flex flex-col gap-1">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Duración total:</span>
                                <span className="font-medium text-violet-500">{duracionTotal} min</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Total:</span>
                                <span className="font-medium text-rose-500">
                                    ${valorTotal.toLocaleString("es-CO")}
                                </span>
                            </div>
                        </div>
                    )}

                    {errors.servicios && (
                        <p className="text-xs text-rose-400 px-1">{errors.servicios}</p>
                    )}
                </div>
            )}

            {/* Paso 3 — Fecha & Hora */}
            {paso === 3 && (
                <div className="flex flex-col gap-4">
                    {/* Fecha */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-500">Fecha</label>
                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => {
                                setFecha(e.target.value)
                                setErrors({})
                            }}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full border border-rose-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 bg-rose-50/30"
                        />
                        {errors.fecha && (
                            <p className="text-xs text-rose-400 px-1">{errors.fecha}</p>
                        )}
                    </div>

                    {/* Hora */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">Hora de inicio</label>
                        
                        {/* Input manual */}
                        <input
                            type="time"
                            value={horaInicio}
                            onChange={(e) => setHoraInicio(e.target.value)}
                            className="w-full border border-rose-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 bg-rose-50/30"
                        />

                        {/* Horas rápidas */}
                        <p className="text-xs text-gray-400 px-1">Horas frecuentes:</p>
                        <div className="grid grid-cols-4 gap-2">
                            {HORAS.map(hora => (
                                <button
                                    key={hora}
                                    type="button"
                                    onClick={() => {
                                        setHoraInicio(hora)
                                        setErrors({})
                                    }}
                                    className={`py-2 rounded-2xl text-sm font-medium transition-all
                                        ${horaInicio === hora
                                            ? "text-white"
                                            : "bg-rose-50 text-gray-500 hover:bg-rose-100"
                                        }`}
                                    style={horaInicio === hora ? {
                                        background: "linear-gradient(135deg, #f43f5e, #a855f7)"
                                    } : {}}
                                >
                                    {hora}
                                </button>
                            ))}
                        </div>
                        {errors.horaInicio && (
                            <p className="text-xs text-rose-400 px-1">{errors.horaInicio}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 mt-2">
                {paso > 1 ? (
                    <Button
                        label="← Atrás"
                        variant="secondary"
                        onClick={() => setPaso(p => p - 1)}
                        fullWidth
                    />
                ) : (
                    <Button
                        label="Cancelar"
                        variant="secondary"
                        onClick={onCancel}
                        fullWidth
                    />
                )}
                {paso < 3 ? (
                    <Button
                        label="Continuar →"
                        onClick={siguientePaso}
                        fullWidth
                    />
                ) : (
                    <Button
                        label={loading ? "Guardando..." : citaEditar ? "✓ Actualizar Cita" : "✓ Confirmar Cita"}
                        onClick={handleSubmit}
                        disabled={loading}
                        fullWidth
                    />
                )}
            </div>
        </div>
    );
};

export default CitaForm;
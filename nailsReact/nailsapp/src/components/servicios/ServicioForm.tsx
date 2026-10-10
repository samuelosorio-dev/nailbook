import { useState, useEffect } from "react";
import { Banknote, Footprints, Hand, Hourglass, Tag } from "lucide-react";
import { TipoServicio, type ServicioRequest, type ServicioResponse } from "../../models/servicio.model";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface ServicioFormProps {
    onSubmit: (data: ServicioRequest) => void;
    onCancel: () => void;
    servicioEditar?: ServicioResponse | null;
    tipoInicial?: number;
    loading?: boolean;
}

const TIPOS = [
    { valor: TipoServicio.Manos as number, label: "Manos", icon: Hand },
    { valor: TipoServicio.Pies as number, label: "Pies", icon: Footprints },
];

const ServicioForm = ({
    onSubmit,
    onCancel,
    servicioEditar,
    tipoInicial = TipoServicio.Manos,
    loading = false,
}: ServicioFormProps) => {
    const [nombre, setNombre] = useState("");
    const [valor, setValor] = useState("");
    const [tipo, setTipo] = useState<number>(tipoInicial);
    const [duracion, setDuracion] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!servicioEditar) return;
        setNombre(servicioEditar.nombre);
        setValor(servicioEditar.valor.toString());
        setTipo(servicioEditar.tipo);
        setDuracion(servicioEditar.duracion.toString());
    }, [servicioEditar]);

    const validar = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
        if (!valor.trim()) newErrors.valor = "El valor es obligatorio";
        else if (Number(valor) <= 0) newErrors.valor = "El valor debe ser mayor a 0";
        if (!duracion.trim()) newErrors.duracion = "La duración es obligatoria";
        else if (Number(duracion) <= 0) newErrors.duracion = "La duración debe ser mayor a 0";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validar()) return;
        onSubmit({
            nombre: nombre.trim(),
            valor: Number(valor),
            tipo,
            duracion: Number(duracion),
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <Input
                label="Nombre"
                placeholder="Ej: Semipermanente"
                value={nombre}
                onChange={setNombre}
                icon={Tag}
                required
                autoFocus={!servicioEditar}
                error={errors.nombre}
            />

            {/* Selector de tipo */}
            <fieldset className="flex flex-col gap-1.5">
                <legend className="text-[13px] font-semibold mb-1.5">
                    Tipo <span className="text-baya-500">*</span>
                </legend>
                <div className="grid grid-cols-2 gap-3">
                    {TIPOS.map((t) => {
                        const activo = tipo === t.valor;
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.valor}
                                type="button"
                                aria-pressed={activo}
                                onClick={() => setTipo(t.valor)}
                                className={`h-12 rounded-xl text-sm flex items-center justify-center gap-2 transition
                                    ${activo
                                        ? "bg-tinta text-white font-bold"
                                        : "bg-white border border-linea text-tinta font-semibold hover:bg-crema"
                                    }`}
                            >
                                <Icon size={18} strokeWidth={1.8} />
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="Valor"
                    placeholder="55000"
                    value={valor}
                    onChange={setValor}
                    icon={Banknote}
                    type="number"
                    inputMode="numeric"
                    required
                    error={errors.valor}
                />
                <Input
                    label="Duración (min)"
                    placeholder="60"
                    value={duracion}
                    onChange={setDuracion}
                    icon={Hourglass}
                    type="number"
                    inputMode="numeric"
                    required
                    error={errors.duracion}
                />
            </div>

            <div className="flex gap-3 mt-2">
                <Button label="Cancelar" variant="secondary" onClick={onCancel} fullWidth />
                <Button
                    label={loading ? "Guardando…" : servicioEditar ? "Actualizar" : "Guardar"}
                    onClick={handleSubmit}
                    disabled={loading}
                    fullWidth
                />
            </div>
        </div>
    );
};

export default ServicioForm;

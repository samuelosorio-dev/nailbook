import { useState, useEffect } from "react";
import { TipoServicio, type ServicioRequest, type ServicioResponse } from "../../models/servicio.model";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface ServicioFormProps {
    onSubmit: (data: ServicioRequest) => void;
    onCancel: () => void;
    servicioEditar?: ServicioResponse | null;
    loading?: boolean;
}

const ServicioForm = ({
    onSubmit,
    onCancel,
    servicioEditar,
    loading = false,
}: ServicioFormProps) => {
    const [nombre, setNombre] = useState("");
    const [valor, setValor] = useState("");
    const [tipo, setTipo] = useState<number>(TipoServicio.Manos);
    const [duracion, setDuracion] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            tipo: tipo,
            duracion: Number(duracion),
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <Input
                label="Nombre"
                placeholder="Nombre del servicio"
                value={nombre}
                onChange={setNombre}
                required
                error={errors.nombre}
            />

            <Input
                label="Valor"
                placeholder="Precio en pesos"
                value={valor}
                onChange={setValor}
                type="number"
                required
                error={errors.valor}
            />

            {/* Selector de tipo */}
            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500">
                    Tipo <span className="text-rose-400">*</span>
                </label>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setTipo(TipoServicio.Manos)}
                        className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all border
                            ${tipo === TipoServicio.Manos
                                ? "text-white border-transparent"
                                : "border-rose-100 text-gray-400 hover:bg-rose-50"
                            }`}
                        style={tipo === TipoServicio.Manos ? {
                            background: "linear-gradient(135deg, #f43f5e, #a855f7)"
                        } : {}}
                    >
                        💅 Manos
                    </button>
                    <button
                        type="button"
                        onClick={() => setTipo(TipoServicio.Pies)}
                        className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all border
                            ${tipo === TipoServicio.Pies
                                ? "text-white border-transparent"
                                : "border-violet-100 text-gray-400 hover:bg-violet-50"
                            }`}
                        style={tipo === TipoServicio.Pies ? {
                            background: "linear-gradient(135deg, #a855f7, #6366f1)"
                        } : {}}
                    >
                        ✨ Pies
                    </button>
                </div>
            </div>

            <Input
                label="Duración (minutos)"
                placeholder="Ej: 60"
                value={duracion}
                onChange={setDuracion}
                type="number"
                required
                error={errors.duracion}
            />

            <div className="flex gap-3 mt-2">
                <Button
                    label="Cancelar"
                    variant="secondary"
                    onClick={onCancel}
                    fullWidth
                />
                <Button
                    label={loading ? "Guardando..." : servicioEditar ? "Actualizar" : "Guardar"}
                    onClick={handleSubmit}
                    disabled={loading}
                    fullWidth
                />
            </div>
        </div>
    );
};

export default ServicioForm;
import { useState, useEffect } from "react";
import type { ClienteRequest, ClienteResponse } from "../../models/cliente.model";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface ClienteFormProps {
    onSubmit: (data: ClienteRequest) => void;
    onCancel: () => void;
    clienteEditar?: ClienteResponse | null;
    loading?: boolean;
}

const ClienteForm = ({
    onSubmit,
    onCancel,
    clienteEditar,
    loading = false,
}: ClienteFormProps) => {
    const [nombre, setNombre] = useState("");
    const [alias, setAlias] = useState("");
    const [telefono, setTelefono] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!clienteEditar) return;
        setNombre(clienteEditar.nombre);
        setAlias(clienteEditar.alias || "");
        setTelefono(clienteEditar.telefono);
    }, [clienteEditar]);

    const validar = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
        if (!telefono.trim()) newErrors.telefono = "El teléfono es obligatorio";
        else if (telefono.length > 15) newErrors.telefono = "Máximo 15 caracteres";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validar()) return;
        onSubmit({
            nombre: nombre.trim(),
            alias: alias.trim() || undefined,
            telefono: telefono.trim(),
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <Input
                label="Nombre"
                placeholder="Nombre de la clienta"
                value={nombre}
                onChange={setNombre}
                required
                error={errors.nombre}
            />
            <Input
                label="Alias"
                placeholder="Apodo o nombre corto (opcional)"
                value={alias}
                onChange={setAlias}
            />
            <Input
                label="Teléfono"
                placeholder="Número de contacto"
                value={telefono}
                onChange={setTelefono}
                required
                error={errors.telefono}
            />
            <div className="flex gap-3 mt-2">
                <Button
                    label="Cancelar"
                    variant="secondary"
                    onClick={onCancel}
                    fullWidth
                />
                <Button
                    label={loading ? "Guardando..." : clienteEditar ? "Actualizar" : "Guardar"}
                    onClick={handleSubmit}
                    disabled={loading}
                    fullWidth
                />
            </div>
        </div>
    );
};

export default ClienteForm;
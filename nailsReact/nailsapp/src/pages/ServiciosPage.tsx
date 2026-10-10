import { useState } from "react";
import { Footprints, Hand, Plus, type LucideIcon } from "lucide-react";
import useServicios from "../hooks/useServicios";
import ServicioList from "../components/servicios/ServicioList";
import ServicioForm from "../components/servicios/ServicioForm";
import AlertaError from "../components/ui/AlertaError";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import PageHeader from "../components/ui/PageHeader";
import { type ServicioResponse, TipoServicio, type ServicioRequest } from "../models/servicio.model";

const ServiciosPage = () => {
    const { servicios, loading, error, crearServicio, editarServicio } = useServicios();
    const [showModal, setShowModal] = useState(false);
    const [servicioEditar, setServicioEditar] = useState<ServicioResponse | null>(null);
    const [tipoActivo, setTipoActivo] = useState<number>(TipoServicio.Manos);

    const serviciosManos = servicios.filter((s) => s.tipo === TipoServicio.Manos);
    const serviciosPies = servicios.filter((s) => s.tipo === TipoServicio.Pies);
    const visibles = tipoActivo === TipoServicio.Manos ? serviciosManos : serviciosPies;

    const handleEdit = (servicio: ServicioResponse) => {
        setServicioEditar(servicio);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setServicioEditar(null);
    };

    const handleSubmit = async (data: ServicioRequest) => {
        const success = servicioEditar
            ? await editarServicio(servicioEditar.id, data)
            : await crearServicio(data);
        if (success) handleCloseModal();
    };

    const tipos: { valor: number; label: string; icon: LucideIcon; total: number }[] = [
        { valor: TipoServicio.Manos, label: "Manos", icon: Hand, total: serviciosManos.length },
        { valor: TipoServicio.Pies, label: "Pies", icon: Footprints, total: serviciosPies.length },
    ];

    return (
        <div>
            <PageHeader
                eyebrow="Carta de servicios"
                titulo="Servicios"
                accion={<Button label="Nuevo" icon={Plus} onClick={() => setShowModal(true)} />}
            />

            {/* Selector Manos / Pies */}
            <div role="tablist" aria-label="Tipo de servicio" className="grid grid-cols-2 gap-3 mb-4">
                {tipos.map((t) => {
                    const activo = tipoActivo === t.valor;
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.valor}
                            type="button"
                            role="tab"
                            aria-selected={activo}
                            onClick={() => setTipoActivo(t.valor)}
                            className={`h-[76px] rounded-[20px] flex items-center gap-3 px-3.5 text-left transition
                                ${activo ? "bg-tinta text-white" : "bg-white border border-linea text-tinta hover:bg-crema"}`}
                        >
                            <span
                                className={`w-10 h-10 rounded-xl grid place-items-center flex-shrink-0
                                    ${activo ? "bg-white/10" : "bg-baya-100 text-baya-800"}`}
                            >
                                <Icon size={20} strokeWidth={1.8} />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-sm font-bold">{t.label}</span>
                                <span className={`block text-xs ${activo ? "text-[#E3CFD8]" : "text-suave"}`}>
                                    {loading ? "…" : `${t.total} servicio${t.total === 1 ? "" : "s"}`}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>

            {error && <AlertaError mensaje={error} />}

            <ServicioList servicios={visibles} onEdit={handleEdit} loading={loading} />

            {showModal && (
                <Modal title={servicioEditar ? "Editar servicio" : "Nuevo servicio"} onClose={handleCloseModal}>
                    <ServicioForm
                        onSubmit={handleSubmit}
                        onCancel={handleCloseModal}
                        servicioEditar={servicioEditar}
                        tipoInicial={tipoActivo}
                        loading={loading}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ServiciosPage;

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import CitaForm from "../components/citas/CitaForm";
import CitaList from "../components/citas/CitaList";
import SemanaSelector from "../components/citas/SemanaSelector";
import AlertaError from "../components/ui/AlertaError";
import Button from "../components/ui/Button";
import IconButton from "../components/ui/IconButton";
import Modal from "../components/ui/Modal";
import PageHeader from "../components/ui/PageHeader";
import Paginacion from "../components/ui/Paginacion";
import SegmentedControl from "../components/ui/SegmentedControl";
import useCitas from "../hooks/useCitas";
import useServicios from "../hooks/useServicios";
import { EstadoCita, type CitaResponse, type CitaRequest } from "../models/cita.model";
import { fechaLocalISO, fechaRelativa, mesAnio } from "../utils/fechas";

const filtros = [
    { label: "Todas", valor: undefined },
    { label: "Programadas", valor: EstadoCita.Programada as number },
    { label: "Finalizadas", valor: EstadoCita.Finalizada as number },
    { label: "Canceladas", valor: EstadoCita.Cancelada as number },
];

interface CitasPageProps {
    abrirNueva?: boolean;
    onNuevaAbierta?: () => void;
}

const CitasPage = ({ abrirNueva = false, onNuevaAbierta }: CitasPageProps) => {
    const {
        citas,
        totalRegistros,
        totalPaginas,
        paginaActual,
        filtroEstado,
        loading,
        error,
        filtroFecha,
        cargarCitas,
        crearCita,
        editarCita,
        cambiarEstado,
        cambiarFiltro,
        cambiarFecha,
    } = useCitas();

    const { servicios } = useServicios();

    const [showModal, setShowModal] = useState(false);
    const [citaEditar, setCitaEditar] = useState<CitaResponse | null>(null);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const hoy = fechaLocalISO();

    // Abre el formulario cuando se pulsa "+" desde la navegación
    useEffect(() => {
        if (!abrirNueva) return;
        setCitaEditar(null);
        setShowModal(true);
        onNuevaAbierta?.();
    }, [abrirNueva, onNuevaAbierta]);

    const handleEdit = (cita: CitaResponse) => {
        setCitaEditar(cita);
        setShowModal(true);
    };

    const handleCancelar = async (id: number) => {
        await cambiarEstado(id, EstadoCita.Cancelada);
    };

    const handleFinalizar = async (id: number) => {
        await cambiarEstado(id, EstadoCita.Finalizada);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCitaEditar(null);
    };

    const handleSubmit = async (data: CitaRequest) => {
        const success = citaEditar ? await editarCita(citaEditar.id, data) : await crearCita(data);
        if (success) handleCloseModal();
    };

    const abrirCalendario = () => {
        const input = dateInputRef.current;
        if (!input) return;
        if (typeof input.showPicker === "function") input.showPicker();
        else input.click();
    };

    return (
        <div>
            <PageHeader
                eyebrow={mesAnio(filtroFecha)}
                titulo="Agenda"
                accion={
                    <>
                        {filtroFecha !== hoy && (
                            <Button label="Hoy" variant="secondary" onClick={() => cambiarFecha(hoy)} />
                        )}
                        <div className="relative">
                            <IconButton icon={CalendarDays} label="Elegir fecha" onClick={abrirCalendario} />
                            <input
                                ref={dateInputRef}
                                type="date"
                                value={filtroFecha}
                                onChange={(e) => e.target.value && cambiarFecha(e.target.value)}
                                tabIndex={-1}
                                aria-hidden="true"
                                className="absolute inset-0 opacity-0 pointer-events-none"
                            />
                        </div>
                        <div className="hidden md:block">
                            <Button label="Nueva cita" icon={Plus} onClick={() => setShowModal(true)} />
                        </div>
                    </>
                }
            />

            <SemanaSelector fecha={filtroFecha} onCambiar={cambiarFecha} />

            <div className="mt-4">
                <SegmentedControl
                    ariaLabel="Filtrar por estado"
                    opciones={filtros}
                    valor={filtroEstado}
                    onChange={cambiarFiltro}
                />
            </div>

            <p className="text-xs text-suave mt-3 mb-3 px-0.5">
                <strong className="text-tinta">{fechaRelativa(filtroFecha)}</strong>
                {!loading && ` · ${totalRegistros} cita${totalRegistros === 1 ? "" : "s"}`}
                <span className="hidden sm:inline"> · desliza una cita para finalizarla o cancelarla</span>
            </p>

            {error && <AlertaError mensaje={error} />}

            <CitaList
                citas={citas}
                onEdit={handleEdit}
                onCancelar={handleCancelar}
                onFinalizar={handleFinalizar}
                loading={loading}
            />

            <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onCambiar={(pagina) => cargarCitas(pagina, filtroEstado)}
                disabled={loading}
            />

            {showModal && (
                <Modal title={citaEditar ? "Editar cita" : "Nueva cita"} onClose={handleCloseModal}>
                    <CitaForm
                        onSubmit={handleSubmit}
                        onCancel={handleCloseModal}
                        citaEditar={citaEditar}
                        loading={loading}
                        servicios={servicios}
                    />
                </Modal>
            )}
        </div>
    );
};

export default CitasPage;

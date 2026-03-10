import { useState } from "react";
import CitaForm from "../components/citas/CitaForm";
import CitaList from "../components/citas/CitaList";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import useCitas from "../hooks/useCitas";
import useServicios from "../hooks/useServicios";
import { EstadoCita, type CitaResponse, type CitaRequest } from "../models/cita.model";
import AppHeader from "../components/ui/AppHeader";

const filtros = [
    { label: "Todas", valor: undefined },
    { label: "Programada", valor: EstadoCita.Programada },
    { label: "Finalizada", valor: EstadoCita.Finalizada },
    { label: "Cancelada", valor: EstadoCita.Cancelada },
];

const CitasPage = () => {
    const {
        citas,
        totalPaginas,
        paginaActual,
        filtroEstado,
        loading,
        error,
        cargarCitas,
        crearCita,
        editarCita,
        cambiarEstado,
        cambiarFiltro,
    } = useCitas();

    const { servicios } = useServicios();

    const [showModal, setShowModal] = useState(false);
    const [citaEditar, setCitaEditar] = useState<CitaResponse | null>(null);

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
        let success = false;
        if (citaEditar) {
            success = await editarCita(citaEditar.id, data);
        } else {
            success = await crearCita(data);
        }
        if (success) handleCloseModal();
    };

    return (
        <div
            className="min-h-screen px-4 pt-8 pb-24"
            
        >
            {/* Solo el fondo con opacidad */}
    <div
        className="fixed inset-0 -z-10"
        style={{ background: "linear-gradient(160deg, #fff0f6 0%, #f5f3ff 50%, #fdf2f8 100%)" }}
    />
            {/* Blob decorativo */}
            <div
                className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #f9a8d4, transparent)", transform: "translate(30%, -30%)" }}
            />

            <div className="max-w-md mx-auto">
                {/* Header */}
                <AppHeader/>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1
                            className="text-2xl font-bold text-rose-900"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            Citas
                        </h1>
                       
                    </div>
                    <Button
                        label={"+ Nueva Cita"}
                        onClick={() => setShowModal(true)}
                    />
                </div>

                {/* Filtros */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {filtros.map((filtro) => {
                        const activo = filtroEstado === filtro.valor;
                        return (
                            <button
                                key={filtro.label}
                                onClick={() => cambiarFiltro(filtro.valor)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                                    ${activo
                                        ? "text-white"
                                        : "border border-rose-100 text-gray-400 hover:bg-rose-50"
                                    }`}
                                style={activo ? {
                                    background: "linear-gradient(135deg, #f43f5e, #a855f7)"
                                } : {}}
                            >
                                {filtro.label}
                            </button>
                        );
                    })}
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-100">
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                )}

                {/* Lista */}
                <CitaList
                    citas={citas}
                    onEdit={handleEdit}
                    onCancelar={handleCancelar}
                    onFinalizar={handleFinalizar}
                    loading={loading}
                />

                {/* Paginación */}
                {totalPaginas > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <button
                            onClick={() => cargarCitas(paginaActual - 1, filtroEstado)}
                            disabled={paginaActual === 1 || loading}
                            className="w-9 h-9 rounded-full border border-rose-200 text-rose-400 hover:bg-rose-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            ←
                        </button>
                        <div className="flex gap-2">
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                                <button
                                    key={pagina}
                                    onClick={() => cargarCitas(pagina, filtroEstado)}
                                    className={`w-9 h-9 rounded-full text-sm font-semibold transition-all
                                        ${paginaActual === pagina
                                            ? "text-white shadow-md"
                                            : "border border-rose-200 text-rose-400 hover:bg-rose-50"
                                        }`}
                                    style={paginaActual === pagina ? {
                                        background: "linear-gradient(135deg, #f43f5e, #a855f7)"
                                    } : {}}
                                >
                                    {pagina}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => cargarCitas(paginaActual + 1, filtroEstado)}
                            disabled={paginaActual === totalPaginas || loading}
                            className="w-9 h-9 rounded-full border border-rose-200 text-rose-400 hover:bg-rose-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <Modal
                    title={citaEditar ? "Editar Cita" : "Nueva Cita"}
                    onClose={handleCloseModal}
                >
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
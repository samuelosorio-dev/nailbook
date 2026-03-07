// src/pages/ServiciosPage.tsx
import {  useState } from "react";
import useServicios from "../hooks/useServicios";
import ServicioList from "../components/servicios/ServicioList";
import ServicioForm from "../components/servicios/ServicioForm";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import { type ServicioResponse, TipoServicio, type ServicioRequest } from "../models/servicio.model";
import AppHeader from "../components/ui/AppHeader";

const ServiciosPage = () => {
    const { servicios, loading, error, crearServicio, editarServicio } = useServicios();
    const [showModal, setShowModal] = useState(false);
    const [servicioEditar, setServicioEditar] = useState<ServicioResponse | null>(null);

    const serviciosManos = servicios.filter(s => s.tipo === TipoServicio.Manos);
    const serviciosPies = servicios.filter(s => s.tipo === TipoServicio.Pies);

    const handleEdit = (servicio: ServicioResponse) => {
        setServicioEditar(servicio);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setServicioEditar(null);
    };

    const handleSubmit = async (data: ServicioRequest) => {
        let success = false;
        if (servicioEditar) {
            success = await editarServicio(servicioEditar.id, data);
        } else {
            success = await crearServicio(data);
        }
        if (success) handleCloseModal();
    };

    return (
        <div
            className="min-h-screen px-4 pt-8 pb-24"
            style={{ background: "linear-gradient(160deg, #fff0f6 0%, #f5f3ff 50%, #fdf2f8 100%)" }}
        >
            {/* Blob decorativo */}
            <div
                className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #f9a8d4, transparent)", transform: "translate(30%, -30%)" }}
            />

            <div className="max-w-md mx-auto">
                {/* Header */}
                <AppHeader/>
                <div className="flex justify-between items-center mb-6">
                    <h1
                        className="text-2xl font-bold text-rose-900"
                        style={{ fontFamily: "'Georgia', serif" }}
                    >
                        Servicios
                    </h1>
                    <Button
                        label="+ Nuevo Servicio"
                        onClick={() => setShowModal(true)}
                    />
                </div>

                {/* Cards resumen */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-rose-50 rounded-2xl p-4 text-center">
                        <p
                            className="text-3xl font-bold"
                            style={{ color: "#f43f5e" }}
                        >
                            {loading ? (
                                <span className="inline-block w-8 h-8 rounded-full border-2 border-rose-300 border-t-rose-500 animate-spin" />
                            ) : (
                                serviciosManos.length
                            )}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Servicios de Manos</p>
                    </div>
                    <div className="bg-violet-50 rounded-2xl p-4 text-center">
                        <p
                            className="text-3xl font-bold"
                            style={{ color: "#a855f7" }}
                        >
                            {loading ? (
                                <span className="inline-block w-8 h-8 rounded-full border-2 border-violet-300 border-t-violet-500 animate-spin" />
                            ) : (
                                serviciosPies.length
                            )}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Servicios de Pies</p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-100">
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                )}

                {/* Lista */}
                <ServicioList
                    servicios={servicios}
                    onEdit={handleEdit}
                    loading={loading}
                />
            </div>

            {/* Modal */}
            {showModal && (
                <Modal
                    title={servicioEditar ? "Editar Servicio" : "Nuevo Servicio"}
                    onClose={handleCloseModal}
                >
                    <ServicioForm
                        onSubmit={handleSubmit}
                        onCancel={handleCloseModal}
                        servicioEditar={servicioEditar}
                        loading={loading}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ServiciosPage;
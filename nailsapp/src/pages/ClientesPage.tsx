import { useEffect, useState } from "react";
import useClientes from "../hooks/useClientes";
import ClienteList from "../components/clientes/ClienteList";
import ClienteForm from "../components/clientes/ClienteForm";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import type { ClienteRequest, ClienteResponse } from "../models/cliente.model";



const ClientesPage = () => {
    const {
        clientes,
        totalRegistros,
        totalPaginas,
        paginaActual,
        loading,
        error,
        cargarClientes,
        buscarClientes,
        crearCliente,
        editarCliente
    } = useClientes();

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [clienteEditar, setClienteEditar] = useState<ClienteResponse | null>(null);
    const [buscando, setBuscando] = useState(false);

    // Debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.trim()) {
                setBuscando(true);
                buscarClientes(search);
            } else {
                setBuscando(false);
                cargarClientes(1);
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [search, cargarClientes, buscarClientes]);

    const handleEdit = (cliente: ClienteResponse) => {
        setClienteEditar(cliente);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setClienteEditar(null);
    };

    const handleSubmit = async (data: ClienteRequest) => {
        let success = false;
        if (clienteEditar) {
            success = await editarCliente(clienteEditar.id, data);
        } else {
            success = await crearCliente(data);
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
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1
                            className="text-2xl font-bold text-rose-900"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            Clientas
                        </h1>
                        
                            <p className="text-xs text-gray-400 mt-1">
                                {search.trim() 
                                    ? `${clientes.length} resultados para "${search}"`
                                    : `${totalRegistros} clientas registradas`
                                }
                            </p>
                        
                    </div>
                    <Button
                        label="+ Nueva Clienta"
                        onClick={() => setShowModal(true)}
                    />
                </div>

                {/* Buscador */}
                <div className="mb-6">
                    <input
                        value={search}
                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            if (!e.target.value.trim()) {
                                                setBuscando(false);
                                            }
                                        }
                                }
                        placeholder="Buscar por nombre o teléfono..."
                        className="w-full border border-rose-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 bg-rose-50/30"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-100">
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                )}

                {/* Lista */}
                <ClienteList
                    clientes={clientes}
                    onEdit={handleEdit}
                    loading={loading}
                />

                {/* Paginación */}
                {!buscando && totalPaginas > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <button
                            onClick={() => cargarClientes(paginaActual - 1)}
                            disabled={paginaActual === 1 || loading}
                            className="w-9 h-9 rounded-full border border-rose-200 text-rose-400 hover:bg-rose-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            ←
                        </button>

                        <div className="flex gap-2">
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                                <button
                                    key={pagina}
                                    onClick={() => cargarClientes(pagina)}
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
                            onClick={() => cargarClientes(paginaActual + 1)}
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
                    title={clienteEditar ? "Editar Clienta" : "Nueva Clienta"}
                    onClose={handleCloseModal}
                >
                    <ClienteForm
                        onSubmit={handleSubmit}
                        onCancel={handleCloseModal}
                        clienteEditar={clienteEditar}
                        loading={loading}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ClientesPage;
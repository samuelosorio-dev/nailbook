import { useEffect, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import useClientes from "../hooks/useClientes";
import ClienteList from "../components/clientes/ClienteList";
import ClienteForm from "../components/clientes/ClienteForm";
import AlertaError from "../components/ui/AlertaError";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import PageHeader from "../components/ui/PageHeader";
import Paginacion from "../components/ui/Paginacion";
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
        editarCliente,
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
        }, 600);

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
        const success = clienteEditar
            ? await editarCliente(clienteEditar.id, data)
            : await crearCliente(data);
        if (success) handleCloseModal();
    };

    return (
        <div>
            <PageHeader
                eyebrow={
                    search.trim()
                        ? `${clientes.length} resultado${clientes.length === 1 ? "" : "s"}`
                        : `${totalRegistros} registrada${totalRegistros === 1 ? "" : "s"}`
                }
                titulo="Clientas"
                accion={<Button label="Nueva" icon={Plus} onClick={() => setShowModal(true)} />}
            />

            {/* Buscador */}
            <label className="flex items-center gap-2.5 h-12 px-3.5 mb-5 rounded-2xl border border-linea bg-white text-suave
                focus-within:border-baya-300 focus-within:ring-4 focus-within:ring-baya-50 transition">
                <Search size={19} strokeWidth={1.8} />
                <span className="sr-only">Buscar clienta</span>
                <input
                    type="search"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (!e.target.value.trim()) setBuscando(false);
                    }}
                    placeholder="Nombre, alias o teléfono"
                    className="flex-1 min-w-0 bg-transparent text-sm text-tinta placeholder:text-tenue focus:outline-none
                        [&::-webkit-search-cancel-button]:hidden"
                />
                {search && (
                    <button
                        type="button"
                        aria-label="Limpiar búsqueda"
                        onClick={() => setSearch("")}
                        className="w-8 h-8 rounded-lg grid place-items-center hover:bg-crema"
                    >
                        <X size={16} />
                    </button>
                )}
            </label>

            {error && <AlertaError mensaje={error} />}

            <ClienteList clientes={clientes} onEdit={handleEdit} loading={loading} buscando={buscando} />

            {!buscando && (
                <Paginacion
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onCambiar={cargarClientes}
                    disabled={loading}
                />
            )}

            {showModal && (
                <Modal title={clienteEditar ? "Editar clienta" : "Nueva clienta"} onClose={handleCloseModal}>
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

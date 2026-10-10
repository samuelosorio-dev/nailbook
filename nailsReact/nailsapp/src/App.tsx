import { useCallback, useState } from "react";
import { CalendarClock } from "lucide-react";
import ClientesPage from "./pages/ClientesPage";
import ServiciosPage from "./pages/ServiciosPage";
import CitasPage from "./pages/CitasPage";
import InicioPage from "./components/inicio/InicioPage";
import Sidebar from "./components/layout/Sidebar";
import BottomNav from "./components/layout/BottomNav";
import EmptyState from "./components/ui/EmptyState";
import type { PaginaId } from "./components/layout/navItems";

function App() {
    const [active, setActive] = useState<PaginaId>("dashboard");
    const [abrirNuevaCita, setAbrirNuevaCita] = useState(false);

    const navegar = useCallback((id: PaginaId) => {
        setActive(id);
        window.scrollTo({ top: 0 });
    }, []);

    // El botón "+" funciona desde cualquier pantalla: lleva a la agenda y abre el formulario
    const solicitarNuevaCita = useCallback(() => {
        setActive("citas");
        setAbrirNuevaCita(true);
    }, []);

    const nuevaCitaAbierta = useCallback(() => setAbrirNuevaCita(false), []);

    const renderPage = () => {
        switch (active) {
            case "dashboard":
                return <InicioPage onNavegar={navegar} onNuevaCita={solicitarNuevaCita} />;
            case "citas":
                return <CitasPage abrirNueva={abrirNuevaCita} onNuevaAbierta={nuevaCitaAbierta} />;
            case "clientes":
                return <ClientesPage />;
            case "servicios":
                return <ServiciosPage />;
            default:
                return <EmptyState icon={CalendarClock} titulo="Próximamente" />;
        }
    };

    return (
        <div className="min-h-screen bg-crema md:flex">
            <Sidebar activa={active} onNavegar={navegar} onNuevaCita={solicitarNuevaCita} />

            <main className="flex-1 min-w-0 pb-28 md:pb-12">
                <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-5xl px-5 md:px-8 pt-6 md:pt-8">
                    {renderPage()}
                </div>
            </main>

            <BottomNav activa={active} onNavegar={navegar} onNuevaCita={solicitarNuevaCita} />
        </div>
    );
}

export default App;

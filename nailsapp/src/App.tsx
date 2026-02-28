import { useState } from "react";
import ClientesPage from "./pages/ClientesPage";

const NAV_ITEMS = [
  { id: "dashboard", label: "Inicio", icon: "✦" },
  { id: "citas", label: "Citas", icon: "◈" },
  { id: "clientes", label: "Clientas", icon: "◉" },
  { id: "servicios", label: "Servicios", icon: "◆" },
];

function App() {
  const [active, setActive] = useState("clientes");

  const renderPage = () => {
    switch (active) {
      case "clientes":
        return <ClientesPage />;
      default:
        return (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-rose-300 text-sm">Próximamente...</p>
          </div>
        );
    }
  };

  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* Página activa */}
      {renderPage()}

      {/* Navegación inferior */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center">
        <div className="max-w-md w-full mx-4 mb-4">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl px-2 py-3 shadow-xl border border-rose-50">
            <div className="flex justify-around">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                    active === item.id ? "text-white" : "text-gray-400 hover:text-rose-400"
                  }`}
                  style={
                    active === item.id
                      ? { background: "linear-gradient(135deg, #f43f5e, #a855f7)" }
                      : {}
                  }
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
import { TriangleAlert } from "lucide-react";

const AlertaError = ({ mensaje }: { mensaje: string }) => (
    <div role="alert" className="mb-4 flex items-start gap-3 p-3.5 rounded-2xl bg-red-50 border border-red-100">
        <TriangleAlert size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-700">{mensaje}</p>
    </div>
);

export default AlertaError;

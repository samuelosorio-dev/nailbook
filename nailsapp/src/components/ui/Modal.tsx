interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({ title, onClose, children }: ModalProps) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(30,10,20,0.5)", backdropFilter: "blur(8px)" }}
        >
            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div
                    className="px-8 pt-8 pb-6"
                    style={{ background: "linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)" }}
                >
                    <div className="flex justify-between items-center">
                        <h2
                            className="text-xl font-bold text-rose-800"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-rose-400 hover:bg-white transition-all"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                <div className="px-8 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
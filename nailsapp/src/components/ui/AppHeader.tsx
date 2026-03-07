const AppHeader = () => {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-lg"
                style={{ background: "linear-gradient(135deg, #f43f5e, #a855f7)" }}
            >
                ✦
            </div>
            <div>
                <p
                    className="font-bold text-rose-900 leading-none"
                    style={{ fontFamily: "'Georgia', serif" }}
                >
                    NailBook
                </p>
                <p className="text-xs text-rose-400">Agenda de Citas</p>
            </div>
        </div>
    );
};

export default AppHeader;
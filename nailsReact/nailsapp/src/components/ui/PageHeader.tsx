interface PageHeaderProps {
    eyebrow?: string;
    titulo: React.ReactNode;
    accion?: React.ReactNode;
}

const PageHeader = ({ eyebrow, titulo, accion }: PageHeaderProps) => {
    return (
        <header className="flex items-end justify-between gap-4 mb-5">
            <div className="min-w-0">
                {eyebrow && (
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-suave first-letter:uppercase">
                        {eyebrow}
                    </p>
                )}
                <h1 className="font-display text-[30px] md:text-4xl font-medium tracking-tight leading-tight mt-0.5">
                    {titulo}
                </h1>
            </div>
            {accion && <div className="flex items-center gap-2 flex-shrink-0">{accion}</div>}
        </header>
    );
};

export default PageHeader;

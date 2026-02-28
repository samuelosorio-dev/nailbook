interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card = ({ children, className = "", onClick }: CardProps) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-2xl p-4 border border-rose-50 
                hover:border-rose-200 hover:shadow-md transition-all ${className}
                ${onClick ? "cursor-pointer" : ""}`}
        >
            {children}
        </div>
    );
};

export default Card;
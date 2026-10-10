interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card = ({ children, className = "", onClick }: CardProps) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-[20px] border border-linea p-4 transition-shadow
                ${onClick ? "cursor-pointer hover:shadow-md hover:shadow-baya-900/5" : ""} ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;

interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
    error?: string;
}

const Input = ({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    required = false,
    error,
}: InputProps) => {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm text-gray-500">
                    {label} {required && <span className="text-rose-400">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`border rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all bg-rose-50/30
                    ${error
                        ? "border-red-300 focus:border-red-400"
                        : "border-rose-100 focus:border-rose-300"
                    }`}
            />
            {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
    );
};

export default Input;
import { useId } from "react";
import type { LucideIcon } from "lucide-react";

interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
    error?: string;
    icon?: LucideIcon;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    min?: string;
    autoFocus?: boolean;
}

const Input = ({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    required = false,
    error,
    icon: Icon,
    inputMode,
    min,
    autoFocus,
}: InputProps) => {
    const id = useId();

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={id} className="text-[13px] font-semibold text-tinta">
                    {label} {required && <span className="text-baya-500">*</span>}
                </label>
            )}
            <div
                className={`flex items-center gap-2.5 h-12 px-3.5 rounded-xl border bg-white transition-all
                    focus-within:ring-4
                    ${error
                        ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-50"
                        : "border-linea focus-within:border-baya-300 focus-within:ring-baya-50"
                    }`}
            >
                {Icon && <Icon size={18} strokeWidth={1.8} className="text-suave flex-shrink-0" />}
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    min={min}
                    autoFocus={autoFocus}
                    aria-invalid={!!error}
                    className="flex-1 min-w-0 h-full bg-transparent text-sm text-tinta placeholder:text-tenue focus:outline-none"
                />
            </div>
            {error && <span className="text-xs font-medium text-red-600">{error}</span>}
        </div>
    );
};

export default Input;

import { Sparkles } from "lucide-react";

const Logo = () => {
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-baya-600 text-white grid place-items-center">
                <Sparkles size={20} strokeWidth={1.8} />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">
                Nail<span className="italic font-medium text-baya-600">Book</span>
            </span>
        </div>
    );
};

export default Logo;

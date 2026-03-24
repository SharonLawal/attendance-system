/**
 * @fileoverview Contextual execution boundary for frontend/src/components/auth/PasswordStrengthIndicator.tsx
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
    password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthProps) {
    const requirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
        { label: "Contains a number", met: /[0-9]/.test(password) },
        { label: "Contains a special character", met: /[\W_]/.test(password) },
    ];

    const metCount = requirements.filter((req) => req.met).length;

    const strengthPercentage = (metCount / requirements.length) * 100;

    const getStrengthColor = () => {
        if (metCount === 0) return "bg-slate-200";
        if (metCount <= 2) return "bg-red-500";
        if (metCount <= 4) return "bg-yellow-500";
        return "bg-emerald-500";
    };

    const getStrengthText = () => {
        if (metCount === 0) return "None";
        if (metCount <= 2) return "Weak";
        if (metCount <= 4) return "Fair";
        return "Strong";
    };

    if (!password) return null;

    return (
        <div className="mt-2 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Password Strength:</span>
                <span className={`${metCount === 5 ? "text-emerald-600" : ""}`}>
                    {getStrengthText()}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ease-out ${getStrengthColor()}`}
                    style={{ width: `${strengthPercentage}%` }}
                />
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {req.met ? (
                            <div className="bg-emerald-100 rounded-full p-0.5 min-w-[16px] min-h-[16px] flex items-center justify-center">
                                <Check size={10} className="text-emerald-600" strokeWidth={3} />
                            </div>
                        ) : (
                            <div className="bg-slate-100 rounded-full p-0.5 min-w-[16px] min-h-[16px] flex items-center justify-center">
                                <X size={10} className="text-slate-400" strokeWidth={2} />
                            </div>
                        )}
                        <span className={`text-[11px] font-medium transition-colors ${req.met ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                            {req.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

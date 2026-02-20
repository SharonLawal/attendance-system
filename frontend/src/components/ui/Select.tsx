import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    label: string;
    value: string;
    disabled?: boolean;
}

interface SelectProps {
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function Select({ options, value, onChange, placeholder = "Select...", className }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className={cn("relative w-full", className)} ref={dropdownRef}>
            <button
                type="button"
                className={cn(
                    "w-full flex items-center justify-between px-3 py-2 bg-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                    isOpen ? "border-blue-500 rounded-b-none" : "border-slate-200 hover:border-slate-300",
                    !selectedOption && "text-slate-500"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full bg-white border border-t-0 border-slate-200 rounded-b-lg shadow-lg max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1">
                    {options.length === 0 ? (
                        <div className="p-3 text-sm text-slate-500 text-center">No options available</div>
                    ) : (
                        <ul className="py-1">
                            {options.map((option) => (
                                <li key={option.value}>
                                    <button
                                        type="button"
                                        disabled={option.disabled}
                                        className={cn(
                                            "w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors",
                                            option.disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "hover:bg-slate-50 cursor-pointer",
                                            value === option.value && !option.disabled && "bg-blue-50 text-blue-700 font-medium"
                                        )}
                                        onClick={() => {
                                            if (!option.disabled) {
                                                onChange(option.value);
                                                setIsOpen(false);
                                            }
                                        }}
                                    >
                                        {option.label}
                                        {value === option.value && <Check className="w-4 h-4" />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}


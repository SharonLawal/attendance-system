/**
 * @fileoverview Contextual execution boundary for frontend/src/components/ui/OTPInput.tsx
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function OTPInput({ length = 6, value, onChange, disabled }: OTPInputProps) {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const chars = value.split("");

            if (chars[index]) {

                chars[index] = "";
                onChange(chars.join(""));
            } else if (index > 0) {

                chars[index - 1] = "";
                onChange(chars.join(""));
                inputsRef.current[index - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {

        let char = e.target.value.toUpperCase();
        char = char.replace(/[^A-Z0-9]/g, "");

        if (char.length > 1) {
            char = char[char.length - 1];
        }

        if (!char && e.target.value !== "") return;

        const chars = value.split("").slice(0, length);

        while (chars.length < length) chars.push("");

        chars[index] = char;
        const newValue = chars.join("");
        onChange(newValue);

        if (char && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "");

        if (!pastedData) return;

        const chars = value.split("").slice(0, length);
        while (chars.length < length) chars.push("");

        let startIndex = chars.findIndex(c => !c);
        if (startIndex === -1) startIndex = 0;

        for (let i = 0; i < pastedData.length; i++) {
            if (startIndex + i < length) {
                chars[startIndex + i] = pastedData[i];
            }
        }

        onChange(chars.join(""));

        const nextIndex = Math.min(startIndex + pastedData.length, length - 1);
        inputsRef.current[nextIndex]?.focus();
    };

    return (
        <div className="flex gap-2 sm:gap-4 w-full justify-between sm:justify-start">
            {Array.from({ length }).map((_, i) => {
                const char = value[i] || "";
                return (
                    <input
                        key={i}
                        ref={(el) => { inputsRef.current[i] = el; }}
                        type="text"
                        inputMode="text"
                        value={char}
                        maxLength={1}
                        disabled={disabled}
                        onChange={(e) => handleInput(i, e)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                        className={cn(
                            "w-12 h-14 sm:w-16 sm:h-20 text-center text-3xl sm:text-4xl font-bold rounded-lg border-2 transition-all outline-none",
                            char
                                ? "bg-white border-babcock-blue text-babcock-blue shadow-sm"
                                : "bg-slate-50 border-slate-200 text-slate-800",
                            "focus:border-babcock-blue focus:ring-4 focus:ring-babcock-blue/20",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                        )}
                    />
                );
            })}
        </div>
    );
}


import React from "react";
import { Check, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationState = "idle" | "requesting" | "averaging" | "verifying" | "success" | "error";

interface VerificationProgressProps {
    state: VerificationState;
    samples?: number;
    totalSamples?: number;
    errorMessage?: string;
}

export function VerificationProgress({
    state,
    samples = 0,
    totalSamples = 5,
    errorMessage
}: VerificationProgressProps) {

    if (state === "idle") return null;

    return (
        <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-4">

                {/* Step 1: GPS Permission */}
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        {state === "requesting" ? (
                            <Loader2 className="w-5 h-5 text-babcock-blue animate-spin" />
                        ) : state === "error" && errorMessage?.includes("permission") ? (
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                            </div>
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className={cn("text-sm font-semibold", state === "requesting" ? "text-babcock-blue" : "text-slate-700")}>
                            Acquiring Location
                        </p>
                        {state === "requesting" && <p className="text-xs text-slate-500 mt-0.5">Please allow GPS access if prompted</p>}
                    </div>
                </div>

                {/* Step 2: Averaging */}
                <div className={cn("flex items-start gap-3 transition-opacity duration-300", state === "requesting" && "opacity-40")}>
                    <div className="mt-0.5 relative flex items-center justify-center w-5 h-5">
                        {state === "averaging" ? (
                            <div className="absolute inset-0 border-2 border-babcock-gold border-r-transparent rounded-full animate-spin" />
                        ) : state === "success" || state === "verifying" || (state === "error" && !errorMessage?.includes("permission")) ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                        ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                        )}
                        {state === "averaging" && <span className="text-[10px] font-bold text-babcock-blue">{samples}</span>}
                    </div>
                    <div className="flex-1">
                        <p className={cn("text-sm font-semibold", state === "averaging" ? "text-babcock-gold" : "text-slate-700")}>
                            Signal Precision
                        </p>
                        {state === "averaging" && (
                            <div className="mt-2 flex gap-1">
                                {Array.from({ length: totalSamples }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all duration-300",
                                            i < samples ? "w-4 bg-babcock-gold" : "w-1.5 bg-slate-200"
                                        )}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Step 3: Verification */}
                <div className={cn("flex items-start gap-3 transition-opacity duration-300", (state === "requesting" || state === "averaging") && "opacity-40")}>
                    <div className="mt-0.5">
                        {state === "verifying" ? (
                            <MapPin className="w-5 h-5 text-babcock-blue animate-bounce" />
                        ) : state === "success" ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                        ) : state === "error" && !errorMessage?.includes("permission") ? (
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                            </div>
                        ) : (
                            <div className="w-2 h-2 flex items-center justify-center relative translate-x-1.5 translate-y-1.5">
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className={cn("text-sm font-semibold", state === "verifying" ? "text-babcock-blue" : state === "success" ? "text-emerald-600" : state === "error" ? "text-red-600" : "text-slate-700")}>
                            {state === "success" ? "Verification Complete" : "Boundary Check"}
                        </p>
                        {state === "verifying" && <p className="text-xs text-slate-500 mt-0.5">Comparing coordinates with classroom polygon</p>}
                        {state === "error" && <p className="text-xs text-red-500 mt-0.5 font-medium">{errorMessage}</p>}
                    </div>
                </div>

            </div>
        </div>
    );
}


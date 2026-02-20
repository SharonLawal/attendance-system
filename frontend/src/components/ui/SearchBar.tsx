import React, { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string;
    iconClassName?: string;
}

export function SearchBar({
    className,
    containerClassName,
    iconClassName,
    ...props
}: SearchBarProps) {
    return (
        <div className={cn("relative w-full", containerClassName)}>
            <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400", iconClassName)} />
            <input
                type="text"
                className={cn(
                    "w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-babcock-blue focus:border-transparent transition-shadow",
                    "placeholder:text-slate-400",
                    className
                )}
                {...props}
            />
        </div>
    );
}


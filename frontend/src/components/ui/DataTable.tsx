import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyAction?: React.ReactNode;
    className?: string;
}

export function DataTable<T>({
    data,
    columns,
    isLoading,
    emptyTitle = "No data found",
    emptyDescription = "There are no records to display at this time.",
    emptyAction,
    className
}: DataTableProps<T>) {

    if (isLoading) {
        return (
            <div className={cn("w-full h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200", className)}>
                <Loader2 className="w-8 h-8 text-babcock-blue animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading data...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className={className}>
                <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                    icon="document"
                />
            </div>
        );
    }

    return (
        <div className={cn("w-full overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm", className)}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} scope="col" className={cn("px-6 py-4 font-semibold tracking-wider", col.className)}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-slate-50/50 transition-colors">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={cn("px-6 py-4 text-slate-700", col.className)}>
                                        {col.cell
                                            ? col.cell(item)
                                            : col.accessorKey
                                                ? (item[col.accessorKey] as React.ReactNode)
                                                : null}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

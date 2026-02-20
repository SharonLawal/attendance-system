import React from "react";
import { SearchX, FileQuestion, CalendarX, FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: "search" | "calendar" | "document" | "folder";
}

export function EmptyState({ title, description, action, icon = "document" }: EmptyStateProps) {

  const IconComponent = {
    search: SearchX,
    calendar: CalendarX,
    document: FileQuestion,
    folder: FolderOpen,
  }[icon];

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center h-full min-h-[300px] bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 text-slate-400">
        <IconComponent className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold font-display text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

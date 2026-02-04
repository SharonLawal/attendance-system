import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
}

export function EmptyState({ icon: Icon, title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
      <div className="p-4 bg-white rounded-full shadow-sm mb-4">
        <Icon size={40} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 max-w-xs mx-auto">{message}</p>
    </div>
  );
}

import React, { useState } from 'react';
import { Modal } from './Modal';
import { FileSpreadsheet, FileText, FileDown } from 'lucide-react';
import { Button } from './Button';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: "csv" | "excel" | "pdf") => void;
    title?: string;
    description?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
    isOpen,
    onClose,
    onExport,
    title = "Export Data",
    description = "Select your preferred format to download the report."
}) => {
    const [selectedFormat, setSelectedFormat] = useState<"csv" | "excel" | "pdf">("csv");

    const handleExport = () => {
        onExport(selectedFormat);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={description}
            maxWidth="md"
        >
            <div className="py-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => setSelectedFormat("csv")}
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${selectedFormat === "csv"
                                ? "bg-blue-50 border-babcock-blue ring-1 ring-babcock-blue/30"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                    >
                        <FileSpreadsheet className={`w-8 h-8 mb-2 ${selectedFormat === 'csv' ? 'text-babcock-blue' : 'text-slate-400'}`} />
                        <span className={`text-sm font-semibold ${selectedFormat === 'csv' ? 'text-babcock-blue' : 'text-slate-600'}`}>CSV</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedFormat("excel")}
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${selectedFormat === "excel"
                                ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500/30"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                    >
                        <FileDown className={`w-8 h-8 mb-2 ${selectedFormat === 'excel' ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <span className={`text-sm font-semibold ${selectedFormat === 'excel' ? 'text-emerald-500' : 'text-slate-600'}`}>Excel</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedFormat("pdf")}
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${selectedFormat === "pdf"
                                ? "bg-red-50 border-red-500 ring-1 ring-red-500/30"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                    >
                        <FileText className={`w-8 h-8 mb-2 ${selectedFormat === 'pdf' ? 'text-red-500' : 'text-slate-400'}`} />
                        <span className={`text-sm font-semibold ${selectedFormat === 'pdf' ? 'text-red-500' : 'text-slate-600'}`}>PDF</span>
                    </button>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleExport}>Download Document</Button>
                </div>
            </div>
        </Modal>
    );
};


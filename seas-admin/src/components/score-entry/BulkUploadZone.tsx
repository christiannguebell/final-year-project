import { useState, useRef } from 'react';
import { CloudUpload, Download, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function BulkUploadZone() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const isCsv = file.name.endsWith('.csv');
    
    if (!isExcel && !isCsv) {
      toast.error('Invalid file format. Please upload an Excel or CSV template.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size exceeds the 25MB limit.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadedFile(null);

    // Mock progress interval
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadedFile(file.name);
          toast.success(`Successfully uploaded and validated "${file.name}"!`);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = (type: 'EXCEL' | 'CSV') => {
    toast.success(`Downloading SEAS score entry ${type.toLowerCase()} template...`);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm space-y-6 flex flex-col h-full justify-between animate-in fade-in slide-in-from-left-3 duration-300">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className="font-headline font-bold text-lg text-primary">Bulk Upload</h3>
        </div>
        <p className="text-on-surface-variant text-xs leading-relaxed">
          Process large datasets efficiently. Upload your standard SEAS Excel or CSV format file here. Validation happens in real-time.
        </p>
      </div>

      {/* Drag & Drop Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex-1 flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all min-h-[240px] ${
          isDragActive 
            ? 'border-primary bg-primary/5 scale-[0.99]' 
            : uploadedFile 
              ? 'border-emerald-200 bg-emerald-50/20' 
              : 'border-outline-variant/30 hover:border-primary hover:bg-slate-50/50'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleFileInput}
          className="hidden" 
        />

        {uploading ? (
          <div className="text-center space-y-4 w-full px-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-primary">Uploading & Validating...</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all duration-200" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant font-medium">{uploadProgress}% Complete</p>
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary truncate max-w-[200px] mx-auto">{uploadedFile}</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">Ready for import</p>
            </div>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setUploadedFile(null);
              }}
              className="text-[10px] text-error hover:underline font-bold mt-2"
            >
              Clear File
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-slate-50 border border-outline-variant/20 rounded-full flex items-center justify-center mx-auto text-on-surface-variant shadow-sm">
              <CloudUpload className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary">Drag & Drop Files</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Maximum file size: 25MB</p>
            </div>
            <button 
              type="button"
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-all"
            >
              Browse Files
            </button>
          </div>
        )}
      </div>

      {/* Templates Downloader */}
      <div className="space-y-3 pt-2">
        <button
          onClick={() => handleDownloadTemplate('EXCEL')}
          className="w-full flex items-center justify-between text-xs text-on-surface-variant hover:text-primary transition-all font-bold px-1"
        >
          <span className="flex items-center gap-1.5">
            Download Templates
          </span>
          <Download className="w-4 h-4" />
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleDownloadTemplate('EXCEL')}
            className="px-3 py-2 border border-outline-variant/15 text-slate-700 hover:bg-slate-50 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1"
          >
            Excel Template
          </button>
          <button 
            onClick={() => handleDownloadTemplate('CSV')}
            className="px-3 py-2 border border-outline-variant/15 text-slate-700 hover:bg-slate-50 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1"
          >
            CSV Template
          </button>
        </div>
      </div>
    </div>
  );
}

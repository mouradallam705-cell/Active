import React, { useRef } from 'react';
import { X, Download, Upload, RotateCcw, Trash2, Database, ShieldCheck } from 'lucide-react';
import { LogEntry, MotivationalQuote } from '../types';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  quotes: MotivationalQuote[];
  onImportLogs: (importedLogs: LogEntry[]) => void;
  onResetToSampleData: () => void;
  onClearAllData: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  logs,
  quotes,
  onImportLogs,
  onResetToSampleData,
  onClearAllData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Export JSON
  const handleExport = () => {
    const dataObj = {
      app: 'مُتَتَابِع',
      exportedAt: new Date().toISOString(),
      logs,
      customQuotes: quotes.filter((q) => q.isCustom),
    };

    const jsonStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mutatabi_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.logs)) {
          onImportLogs(parsed.logs);
          alert('تم استيراد البيانات وتجديد العدادات بنجاح!');
          onClose();
        } else {
          alert('الملف المحدد لا يحتوي على صيغة بيانات مجردة صحيحة.');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-[#0e0d0b] border border-[#2a2419] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#221d15] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#f5f0e6] font-['Amiri',serif]">
                إدارة البيانات والنسخ الاحتياطي
              </h2>
              <p className="text-xs text-[#a09888]">
                تصدير أو استيراد سجلات التمارين وحماية بياناتك
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#a09888] hover:text-[#f5f0e6] bg-[#14120e] rounded-xl border border-[#262118] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-between p-4 bg-[#14120e] hover:bg-[#1a1713] border border-[#262118] hover:border-[#c5a059]/50 rounded-2xl text-right transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25 group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold text-[#f5f0e6] font-['Amiri',serif]">تصدير نسخة احتياطية (JSON)</span>
                <span className="block text-xs text-[#a09888]">تحميل ملف يحتوي كافة سجلاتك واقتباساتك</span>
              </div>
            </div>
          </button>

          {/* Import Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-4 bg-[#14120e] hover:bg-[#1a1713] border border-[#262118] hover:border-[#c5a059]/50 rounded-2xl text-right transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25 group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold text-[#f5f0e6] font-['Amiri',serif]">استيراد بيانات من ملف</span>
                <span className="block text-xs text-[#a09888]">استرجاع سجلاتك وسلسلتك السابقة</span>
              </div>
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Reset to Sample Data */}
          <button
            onClick={() => {
              if (confirm('هل تريد إعادة تعيين البيانات إلى البيانات التوضيحية النموذجية؟')) {
                onResetToSampleData();
                onClose();
              }
            }}
            className="w-full flex items-center justify-between p-4 bg-[#14120e] hover:bg-[#1a1713] border border-[#262118] hover:border-[#c5a059]/50 rounded-2xl text-right transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25 group-hover:scale-105 transition-transform">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold text-[#f5f0e6] font-['Amiri',serif]">تحميل السجلات النموذجية التوضيحية</span>
                <span className="block text-xs text-[#a09888]">يعرض نموذج استمرارية واقعي للتجربة</span>
              </div>
            </div>
          </button>

          {/* Clear All Data */}
          <button
            onClick={() => {
              if (confirm('تنبيه: هل أنت متأكد من حذف جميع السجلات والبدء من جديد تماماً؟')) {
                onClearAllData();
                onClose();
              }
            }}
            className="w-full flex items-center justify-between p-4 bg-[#1a0a0a] hover:bg-[#260e0e] border border-[#8b2626]/40 rounded-2xl text-right transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#8b2626]/20 text-[#e06666] border border-[#8b2626]/30 group-hover:scale-105 transition-transform">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold text-[#e06666] font-['Amiri',serif]">مسح كافة البيانات (تصفير شامل)</span>
                <span className="block text-xs text-[#e06666]/80">حذف كلي لجميع الأيام والسلاسل</span>
              </div>
            </div>
          </button>

        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-[#a09888] text-center flex items-center justify-center gap-1.5 pt-2 border-t border-[#221d15]">
          <ShieldCheck className="w-4 h-4 text-[#c5a059] shrink-0" />
          <span>تُحفظ جميع بياناتك بأمان تام على متصفحك المحلي (LocalStorage).</span>
        </p>

      </div>
    </div>
  );
};

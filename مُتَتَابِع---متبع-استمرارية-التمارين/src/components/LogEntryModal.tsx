import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Dumbbell, Clock, Calendar, FileText, Sparkles } from 'lucide-react';
import { LogEntry, EntryStatus, WorkoutType } from '../types';
import { getTodayDateString, getCurrentTimeString } from '../utils/streakUtils';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entryData: Omit<LogEntry, 'id' | 'streakCount'>) => void;
  initialEntry?: LogEntry | null;
  defaultStatus?: EntryStatus;
}

const WORKOUT_TYPES: WorkoutType[] = [
  'حديد / أثقال',
  'كارديو',
  'جري',
  'مشي سريع',
  'سباحة',
  'دراجة',
  'لياقة بدنية / سويدي',
  'يوغا / إطالات',
  'رياضة أخرى',
];

export const LogEntryModal: React.FC<LogEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEntry,
  defaultStatus = 'exercised',
}) => {
  const [date, setDate] = useState<string>(getTodayDateString());
  const [time, setTime] = useState<string>(getCurrentTimeString());
  const [status, setStatus] = useState<EntryStatus>(defaultStatus);
  const [workoutType, setWorkoutType] = useState<string>('حديد / أثقال');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialEntry) {
      setDate(initialEntry.date);
      setTime(initialEntry.time || getCurrentTimeString());
      setStatus(initialEntry.status);
      setWorkoutType(initialEntry.workoutType || 'حديد / أثقال');
      setDurationMinutes(initialEntry.durationMinutes || 45);
      setNotes(initialEntry.notes || '');
    } else {
      setDate(getTodayDateString());
      setTime(getCurrentTimeString());
      setStatus(defaultStatus);
      setWorkoutType('حديد / أثقال');
      setDurationMinutes(45);
      setNotes('');
    }
  }, [initialEntry, isOpen, defaultStatus]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      time,
      status,
      workoutType: status === 'exercised' ? workoutType : undefined,
      durationMinutes: status === 'exercised' ? durationMinutes : undefined,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#0e0d0b] border border-[#2a2419] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#221d15] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#f5f0e6] font-['Amiri',serif]">
                {initialEntry ? 'تعديل السجل' : 'تسجيل نشاط يومي جديد'}
              </h2>
              <p className="text-xs text-[#a09888]">
                سجل تاريخ ووقت التمرين أو حالة التوقف لإعادة العداد
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

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Status Selection (Exercised vs Missed) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#a09888] block">
              حالة اليوم: هل مارست التمرين؟ <span className="text-[#e06666]">*</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('exercised')}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border font-bold text-sm transition-all cursor-pointer ${
                  status === 'exercised'
                    ? 'bg-[#c5a059]/20 border-[#c5a059] text-[#e6ca85] shadow-md shadow-[#c5a059]/10'
                    : 'bg-[#14120e] border-[#262118] text-[#a09888] hover:text-[#f5f0e6]'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 ${status === 'exercised' ? 'text-[#c5a059]' : 'text-[#554d40]'}`} />
                <span>تمرّنت اليوم 🟢</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('missed')}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border font-bold text-sm transition-all cursor-pointer ${
                  status === 'missed'
                    ? 'bg-[#8b2626]/25 border-[#8b2626] text-[#e06666] shadow-md shadow-[#8b2626]/10'
                    : 'bg-[#14120e] border-[#262118] text-[#a09888] hover:text-[#f5f0e6]'
                }`}
              >
                <XCircle className={`w-5 h-5 ${status === 'missed' ? 'text-[#e06666]' : 'text-[#554d40]'}`} />
                <span>لم أتدرّب اليوم 🔴</span>
              </button>
            </div>

            {status === 'missed' && (
              <p className="text-xs text-[#e06666] bg-[#8b2626]/15 p-3 rounded-xl border border-[#8b2626]/30 mt-2">
                ⚠️ اختيارك لـ &quot;لم أتدرّب اليوم&quot; سوف يعيد عداد استمرارية الأيام إلى اليوم صفر (0)، وسيبدأ العد مجدداً بعد أول تمرين قادم.
              </p>
            )}
          </div>

          {/* Date & Time Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#a09888] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>التاريخ</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-[#14120e] border border-[#2a2419] rounded-xl px-3.5 py-2.5 text-[#f5f0e6] text-sm focus:outline-none focus:border-[#c5a059] transition-colors font-['Amiri',serif]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#a09888] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>الوقت</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-[#14120e] border border-[#2a2419] rounded-xl px-3.5 py-2.5 text-[#f5f0e6] text-sm focus:outline-none focus:border-[#c5a059] transition-colors font-['Amiri',serif]"
              />
            </div>
          </div>

          {/* Conditional Exercise Options */}
          {status === 'exercised' && (
            <>
              {/* Workout Type Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#a09888] block">
                  نوع التمرين:
                </label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                  {WORKOUT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWorkoutType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        workoutType === type
                          ? 'bg-[#c5a059] text-[#050505] font-black shadow-md'
                          : 'bg-[#14120e] hover:bg-[#1a1713] text-[#a09888] hover:text-[#f5f0e6] border border-[#262118]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-[#a09888] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>مدة التمرين بالدقائق</span>
                  </label>
                  <span className="font-black text-[#e6ca85] bg-[#c5a059]/10 px-2 py-0.5 rounded border border-[#c5a059]/20 font-['Amiri',serif]">
                    {durationMinutes} دقيقة
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={180}
                  step={5}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full accent-[#c5a059] cursor-pointer"
                />
              </div>
            </>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#a09888] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>ملاحظات وانطباعك عن اليوم (اختياري):</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={status === 'exercised' ? 'مثال: شعور رائع، تم زيادة الأوزان والتزام قوي...' : 'مثال: انشغال في العمل وسفر، العودة غداً بقوة إن شاء الله...'}
              rows={3}
              className="w-full bg-[#14120e] border border-[#2a2419] rounded-xl p-3 text-[#f5f0e6] text-sm focus:outline-none focus:border-[#c5a059] transition-colors resize-none placeholder:text-[#6e6659] font-['Amiri',serif]"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#221d15]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#2a2419] text-[#a09888] font-bold hover:bg-[#14120e] hover:text-[#f5f0e6] text-sm transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-[#b38f46] via-[#c5a059] to-[#d4af37] hover:from-[#c5a059] hover:to-[#e6ca85] text-[#050505] font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-[#c5a059]/15 text-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{initialEntry ? 'حفظ التعديلات' : 'تسجيل الانجاز'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

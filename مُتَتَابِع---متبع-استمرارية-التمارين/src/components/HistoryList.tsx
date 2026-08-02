import React, { useState } from 'react';
import { History, CheckCircle2, XCircle, Clock, Calendar, Edit3, Trash2, Filter, Dumbbell, Flame, MessageSquare } from 'lucide-react';
import { LogEntry } from '../types';
import { formatArabicDate, formatArabicTime } from '../utils/streakUtils';

interface HistoryListProps {
  logs: LogEntry[];
  onEditLog: (log: LogEntry) => void;
  onDeleteLog: (id: string) => void;
  onOpenLogModal: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  logs,
  onEditLog,
  onDeleteLog,
  onOpenLogModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'exercised' | 'missed'>('all');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'exercised') return log.status === 'exercised';
    if (filter === 'missed') return log.status === 'missed';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#0e0d0b] border border-[#2a2419] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#f5f0e6] font-['Amiri',serif]">
              سجل النشاطات والتكرارات
            </h2>
            <p className="text-xs text-[#a09888]">
              استعرض تواريخ وأوقات التمارين وحالات التوقف المسجلة مسبقاً
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-[#14120e] p-1.5 rounded-2xl border border-[#262118]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#c5a059] text-[#050505] font-black shadow-md'
                : 'text-[#a09888] hover:text-[#f5f0e6]'
            }`}
          >
            الكل ({logs.length})
          </button>

          <button
            onClick={() => setFilter('exercised')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'exercised'
                ? 'bg-[#c5a059] text-[#050505] font-black shadow-md'
                : 'text-[#a09888] hover:text-[#f5f0e6]'
            }`}
          >
            تمارين 🟢 ({logs.filter((l) => l.status === 'exercised').length})
          </button>

          <button
            onClick={() => setFilter('missed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'missed'
                ? 'bg-[#8b2626] text-[#f5f0e6] font-black shadow-md'
                : 'text-[#a09888] hover:text-[#f5f0e6]'
            }`}
          >
            توقف 🔴 ({logs.filter((l) => l.status === 'missed').length})
          </button>
        </div>
      </div>

      {/* Logs Timeline List */}
      {filteredLogs.length === 0 ? (
        <div className="bg-[#0e0d0b]/60 border border-[#221d15] rounded-3xl p-12 text-center space-y-4">
          <History className="w-12 h-12 text-[#554d40] mx-auto" />
          <h3 className="text-lg font-bold text-[#f5f0e6] font-['Amiri',serif]">لا توجد سجلات مطابقة</h3>
          <p className="text-xs text-[#a09888] max-w-sm mx-auto">
            لم تقم بتسجيل أي نشاط يطابق الفئة المحددة بعد. ابدأ الآن بتسجيل أول تمرين!
          </p>
          <button
            onClick={onOpenLogModal}
            className="inline-flex items-center gap-2 bg-[#c5a059] text-[#050505] font-black px-5 py-2.5 rounded-xl text-xs shadow-lg cursor-pointer hover:bg-[#e6ca85]"
          >
            + تسجيل حالة اليوم
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const isExercised = log.status === 'exercised';

            return (
              <div
                key={log.id}
                className={`relative overflow-hidden bg-[#0e0d0b] hover:bg-[#14120e] border rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-md ${
                  isExercised ? 'border-[#241f17] hover:border-[#c5a059]/50' : 'border-[#8b2626]/40 bg-[#170a0a]'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Left Side: Status Icon, Date & Details */}
                  <div className="flex items-start gap-3.5">
                    
                    {/* Status Badge Icon */}
                    <div className={`p-3 rounded-2xl border shrink-0 mt-0.5 ${
                      isExercised
                        ? 'bg-[#c5a059]/10 text-[#c5a059] border-[#c5a059]/25'
                        : 'bg-[#8b2626]/20 text-[#e06666] border-[#8b2626]/40'
                    }`}>
                      {isExercised ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Label */}
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          isExercised ? 'bg-[#c5a059]/20 text-[#e6ca85]' : 'bg-[#8b2626]/25 text-[#e06666]'
                        }`}>
                          {isExercised ? 'تمرين مكتمل 🟢' : 'توقف (إعادة للعد 0) 🔴'}
                        </span>

                        {/* Date */}
                        <span className="text-sm font-bold text-[#f5f0e6] flex items-center gap-1 font-['Amiri',serif]">
                          <Calendar className="w-3.5 h-3.5 text-[#a09888]" />
                          <span>{formatArabicDate(log.date)}</span>
                        </span>

                        {/* Time */}
                        <span className="text-xs text-[#a09888] flex items-center gap-1 bg-[#14120e] px-2 py-0.5 rounded-md border border-[#262118]">
                          <Clock className="w-3 h-3 text-[#a09888]" />
                          <span>{formatArabicTime(log.time)}</span>
                        </span>
                      </div>

                      {/* Workout type & duration */}
                      {isExercised && (
                        <div className="flex items-center gap-3 text-xs text-[#a09888] pt-1">
                          <span className="font-bold flex items-center gap-1 text-[#e6ca85]">
                            <Dumbbell className="w-3.5 h-3.5" />
                            <span>{log.workoutType || 'تمرين عام'}</span>
                          </span>

                          {log.durationMinutes && (
                            <span className="text-[#a09888]">
                              • المدة: {log.durationMinutes} دقيقة
                            </span>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      {log.notes && (
                        <p className="text-xs text-[#f5f0e6] bg-[#14120e] p-2 rounded-xl border border-[#2a2419] mt-1 flex items-start gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#a09888] shrink-0 mt-0.5" />
                          <span>{log.notes}</span>
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Right Side: Streak Badge & Actions */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#221d15]">
                    
                    {/* Streak Count Badge */}
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#14120e] border border-[#2a2419] text-xs font-bold text-[#a09888]">
                      <Flame className={`w-4 h-4 ${log.streakCount > 0 ? 'text-[#c5a059]' : 'text-[#554d40]'}`} />
                      <span>السلسلة وقتها: </span>
                      <strong className={log.streakCount > 0 ? 'text-[#c5a059] font-black' : 'text-[#554d40] font-black'}>
                        {log.streakCount} {log.streakCount === 1 ? 'يوم' : 'أيام'}
                      </strong>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditLog(log)}
                        title="تعديل السجل"
                        className="p-2 text-[#a09888] hover:text-[#c5a059] hover:bg-[#1f1b15] rounded-xl transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('هل أنت تأكد من رغبتك في حذف هذا السجل؟')) {
                            onDeleteLog(log.id);
                          }
                        }}
                        title="حذف السجل"
                        className="p-2 text-[#a09888] hover:text-[#e06666] hover:bg-[#1f1b15] rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, XCircle, Flame, Dumbbell, Calendar as CalendarIcon, Info } from 'lucide-react';
import { LogEntry } from '../types';
import { ARABIC_MONTHS, ARABIC_DAYS, formatArabicDate } from '../utils/streakUtils';

interface CalendarViewProps {
  logs: LogEntry[];
  onSelectDateToLog: (dateStr: string) => void;
  onEditLog: (log: LogEntry) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  logs,
  onSelectDateToLog,
  onEditLog,
}) => {
  const todayObj = new Date();
  const [currentYear, setCurrentYear] = useState<number>(todayObj.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayObj.getMonth()); // 0 - 11

  // Map logs by date string YYYY-MM-DD for O(1) lookup
  const logsByDate = React.useMemo(() => {
    const map = new Map<string, LogEntry>();
    logs.forEach((log) => {
      map.set(log.date, log);
    });
    return map;
  }, [logs]);

  // Navigate Months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(todayObj.getFullYear());
    setCurrentMonth(todayObj.getMonth());
  };

  // Calculate calendar days
  // First day of month
  const firstDayOfMonthObj = new Date(currentYear, currentMonth, 1);
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Day of week index (Saturday = 0, Sunday = 1, ..., Friday = 6)
  // JS Date.getDay(): Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
  // Shift to Saturday-first: (day + 1) % 7
  const startDayOfWeekIndex = (firstDayOfMonthObj.getDay() + 1) % 7;

  // Monthly Statistics
  const monthLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const [y, m] = log.date.split('-').map(Number);
      return y === currentYear && m === currentMonth + 1;
    });
  }, [logs, currentYear, currentMonth]);

  const monthExercisedCount = monthLogs.filter((l) => l.status === 'exercised').length;
  const monthMissedCount = monthLogs.filter((l) => l.status === 'missed').length;
  const monthComplianceRate = monthLogs.length > 0 
    ? Math.round((monthExercisedCount / monthLogs.length) * 100) 
    : 0;

  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      
      {/* Calendar Header Bar */}
      <div className="bg-[#0e0d0b] border border-[#2a2419] rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#f5f0e6] font-['Amiri',serif] flex items-center gap-2">
              <span>تقويم استمرارية التمارين</span>
            </h2>
            <p className="text-xs text-[#a09888]">
              تصفح الأيام وتتبع الشارة الذهبية للالتزام والشارة الحمراء لإعادة العداد
            </p>
          </div>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 bg-[#14120e] p-1.5 rounded-2xl border border-[#262118]">
          <button
            onClick={handlePrevMonth}
            className="p-2 text-[#a09888] hover:text-[#f5f0e6] hover:bg-[#1f1b15] rounded-xl transition-colors cursor-pointer"
            title="الشهر السابق"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="text-center px-3 font-black text-[#f5f0e6] text-base min-w-36 font-['Amiri',serif]">
            {ARABIC_MONTHS[currentMonth]} {currentYear}
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 text-[#a09888] hover:text-[#f5f0e6] hover:bg-[#1f1b15] rounded-xl transition-colors cursor-pointer"
            title="الشهر التالي"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleJumpToToday}
            className="text-xs font-bold bg-[#c5a059]/20 text-[#e6ca85] hover:bg-[#c5a059]/30 px-3 py-1.5 rounded-xl border border-[#c5a059]/35 transition-colors cursor-pointer"
          >
            اليوم
          </button>
        </div>
      </div>

      {/* Monthly Summary Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0e0d0b] border border-[#241f17] rounded-2xl p-4 text-center">
          <span className="text-xs text-[#a09888] block font-semibold mb-1">تمارين الشهر</span>
          <span className="text-2xl font-black text-[#c5a059] font-['Amiri',serif]">
            {monthExercisedCount} <span className="text-xs font-normal text-[#a09888]">يوم</span>
          </span>
        </div>

        <div className="bg-[#0e0d0b] border border-[#241f17] rounded-2xl p-4 text-center">
          <span className="text-xs text-[#a09888] block font-semibold mb-1">أيام التوقف (تصفير)</span>
          <span className="text-2xl font-black text-[#e06666] font-['Amiri',serif]">
            {monthMissedCount} <span className="text-xs font-normal text-[#a09888]">يوم</span>
          </span>
        </div>

        <div className="bg-[#0e0d0b] border border-[#241f17] rounded-2xl p-4 text-center">
          <span className="text-xs text-[#a09888] block font-semibold mb-1">نسبة الالتزام الشهرية</span>
          <span className="text-2xl font-black text-[#e6ca85] font-['Amiri',serif]">
            %{monthComplianceRate}
          </span>
        </div>

        <div className="bg-[#0e0d0b] border border-[#241f17] rounded-2xl p-4 text-center">
          <span className="text-xs text-[#a09888] block font-semibold mb-1">إجمالي الأيام المسجلة</span>
          <span className="text-2xl font-black text-[#c5a059] font-['Amiri',serif]">
            {monthLogs.length} <span className="text-xs font-normal text-[#a09888]">سجل</span>
          </span>
        </div>
      </div>

      {/* Main Calendar Grid Card */}
      <div className="bg-[#0e0d0b] border border-[#2a2419] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-[#a09888] border-b border-[#262118] pb-3">
          {ARABIC_DAYS.map((dayName) => (
            <div key={dayName} className="py-1">
              <span className="hidden sm:inline">{dayName}</span>
              <span className="sm:hidden">{dayName.slice(0, 3)}</span>
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {/* Leading empty cells */}
          {Array.from({ length: startDayOfWeekIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-20 sm:h-24 rounded-2xl bg-[#090806]/40 border border-transparent opacity-30 pointer-events-none" />
          ))}

          {/* Month Day Cells */}
          {Array.from({ length: totalDaysInMonth }).map((_, dayIdx) => {
            const dayNum = dayIdx + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const log = logsByDate.get(dateStr);
            const isToday = dateStr === todayStr;

            return (
              <div
                key={dateStr}
                onClick={() => {
                  if (log) {
                    onEditLog(log);
                  } else {
                    onSelectDateToLog(dateStr);
                  }
                }}
                className={`group relative h-20 sm:h-24 rounded-2xl p-1.5 sm:p-2.5 border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
                  log?.status === 'exercised'
                    ? 'bg-gradient-to-b from-[#c5a059]/20 to-[#18140c] border-[#c5a059]/50 hover:border-[#e6ca85] shadow-md shadow-[#c5a059]/10'
                    : log?.status === 'missed'
                    ? 'bg-gradient-to-b from-[#8b2626]/20 to-[#120a0a] border-[#8b2626]/50 hover:border-[#e06666] shadow-md shadow-[#8b2626]/10'
                    : isToday
                    ? 'bg-[#181510] border-[#c5a059] hover:bg-[#201c15] shadow-lg shadow-[#c5a059]/10'
                    : 'bg-[#12100d] border-[#221d15] hover:border-[#382f22] hover:bg-[#181511]'
                }`}
              >
                {/* Header of Cell: Day Number & Today badge */}
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs sm:text-sm font-black font-['Amiri',serif] ${
                    isToday ? 'text-[#e6ca85]' : 'text-[#f5f0e6]'
                  }`}>
                    {dayNum}
                  </span>

                  {isToday && (
                    <span className="text-[9px] font-black bg-[#c5a059] text-[#050505] px-1.5 py-0.5 rounded-full">
                      اليوم
                    </span>
                  )}
                </div>

                {/* Middle Content: Status Badge */}
                <div className="flex flex-col items-center justify-center my-auto">
                  {log?.status === 'exercised' ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#c5a059]/25 text-[#e6ca85] flex items-center justify-center border border-[#c5a059]/40">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                      </div>
                      <span className="text-[10px] font-bold text-[#e6ca85] truncate max-w-full hidden sm:block">
                        {log.workoutType || 'تمرين'}
                      </span>
                    </div>
                  ) : log?.status === 'missed' ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#8b2626]/25 text-[#e06666] flex items-center justify-center border border-[#8b2626]/40">
                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[#e06666] truncate max-w-full hidden sm:block">
                        توقف (0)
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#6e6659] opacity-0 group-hover:opacity-100 transition-opacity">
                      + تسجيل
                    </span>
                  )}
                </div>

                {/* Footer of Cell: Streak Counter if Exercised */}
                {log?.status === 'exercised' && (
                  <div className="flex items-center justify-end w-full">
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-black bg-[#c5a059]/20 text-[#e6ca85] px-1.5 py-0.2 rounded border border-[#c5a059]/30">
                      <Flame className="w-2.5 h-2.5 text-[#c5a059]" />
                      <span>{log.streakCount}</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-[#262118] text-xs text-[#a09888]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#c5a059] border border-[#e6ca85]" />
            <span>يوم تمرين (يضيف لسلسلتك 🟢)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#8b2626] border border-[#e06666]" />
            <span>يوم توقف (تصفير العداد إلى 0 🔴)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#c5a059] bg-[#181510]" />
            <span>تاريخ اليوم الحالي</span>
          </div>
        </div>

      </div>
    </div>
  );
};

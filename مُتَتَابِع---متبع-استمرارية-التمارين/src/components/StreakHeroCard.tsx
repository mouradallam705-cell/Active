import React from 'react';
import { Flame, CheckCircle2, XCircle, Trophy, Activity, Target, CalendarDays, Sparkles, AlertTriangle } from 'lucide-react';
import { StreakStats } from '../types';
import { formatArabicDate } from '../utils/streakUtils';

interface StreakHeroCardProps {
  stats: StreakStats;
  onQuickLogExercised: () => void;
  onQuickLogMissed: () => void;
  onOpenDetailedModal: () => void;
  hasLoggedToday: boolean;
  todayLogStatus?: 'exercised' | 'missed';
}

export const StreakHeroCard: React.FC<StreakHeroCardProps> = ({
  stats,
  onQuickLogExercised,
  onQuickLogMissed,
  onOpenDetailedModal,
  hasLoggedToday,
  todayLogStatus,
}) => {
  const isStreakActive = stats.currentStreak > 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0e0d0b] border border-[#2a2419] p-6 sm:p-8 shadow-2xl">
      {/* Background Subtle Gradient Glow */}
      <div 
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700 ${
          isStreakActive ? 'bg-[#c5a059]' : 'bg-[#9b2c2c]'
        }`} 
      />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15 bg-[#c5a059]" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
        
        {/* Main Counter Display */}
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#171410] border border-[#2e271c] text-xs font-bold text-[#c5a059]">
            <Sparkles className="w-3.5 h-3.5 text-[#e6ca85]" />
            <span>نظام حساب الأيام المتتالية واستعادة العد</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-4 rounded-2xl border ${
                isStreakActive 
                  ? 'bg-gradient-to-tr from-[#c5a059]/20 to-[#8a6d30]/10 border-[#c5a059]/40 text-[#e6ca85] shadow-lg shadow-[#c5a059]/10' 
                  : 'bg-[#8b2626]/15 border-[#8b2626]/40 text-[#e06666]'
              }`}>
                {isStreakActive ? (
                  <Flame className="w-10 h-10 text-[#c5a059] animate-pulse" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-[#e06666]" />
                )}
              </div>

              <div>
                <span className="text-[#a09888] text-sm font-semibold block">
                  {isStreakActive ? 'سلسلة الالتزام الحالية' : 'حالة العداد الحالية'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl sm:text-6xl font-black font-['Amiri',serif] tracking-tight ${
                    isStreakActive ? 'text-[#f5f0e6]' : 'text-[#c0b8ac]'
                  }`}>
                    {stats.currentStreak}
                  </span>
                  <span className="text-xl font-bold text-[#c5a059]">
                    {stats.currentStreak === 1 ? 'يوم' : stats.currentStreak >= 2 && stats.currentStreak <= 10 ? 'أيام' : 'يوماً'}
                  </span>
                </div>
              </div>
            </div>

            {/* Streak Status Tagline */}
            <div className="sm:border-r sm:border-[#262118] sm:pr-6 mt-2 sm:mt-0">
              {isStreakActive ? (
                <p className="text-sm font-medium text-[#c5a059] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059] shrink-0" />
                  <span>أنت في تتابع إيجابي ممتاز! كل يوم تمرين يضيف يوماً كبيراً لسلسلتك.</span>
                </p>
              ) : (
                <p className="text-sm font-medium text-[#e06666] flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-[#e06666] shrink-0" />
                  <span>العداد حالياً عند اليوم صفر. سجل تمرين اليوم لتبدأ عداً متتالياً جديداً!</span>
                </p>
              )}
            </div>
          </div>

          {/* Today's Quick Actions */}
          <div className="pt-2">
            <div className="text-xs font-bold text-[#a09888] mb-3 flex items-center justify-between">
              <span>تسجيل حالة اليوم ({formatArabicDate(new Date().toISOString().split('T')[0])}):</span>
              {hasLoggedToday && (
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                  todayLogStatus === 'exercised' ? 'bg-[#c5a059]/20 text-[#e6ca85] border-[#c5a059]/30' : 'bg-[#8b2626]/20 text-[#e06666] border-[#8b2626]/30'
                }`}>
                  تم التسجيل لليوم ({todayLogStatus === 'exercised' ? 'تمرّنت 🟢' : 'لم أتدرّب 🔴'})
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Exercised Button */}
              <button
                onClick={onQuickLogExercised}
                className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#8a6d30] via-[#c5a059] to-[#d4af37] hover:from-[#c5a059] hover:to-[#e6ca85] text-[#050505] font-black px-6 py-4 rounded-2xl shadow-xl shadow-[#c5a059]/20 border border-[#e6ca85]/40 transition-all duration-200 cursor-pointer active:scale-98"
                id="hero-exercised-button"
              >
                <div className="w-8 h-8 rounded-full bg-[#050505]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5 text-[#050505]" />
                </div>
                <div className="text-right">
                  <span className="block text-base leading-tight">تمرّنت اليوم! 🏋️‍♂️</span>
                  <span className="block text-xs text-[#1f190e] font-semibold">يحتسب يوماً إضافياً للسلسلة</span>
                </div>
              </button>

              {/* Missed Button (Resets to Day 0) */}
              <button
                onClick={onQuickLogMissed}
                className="group relative flex items-center justify-center gap-3 bg-[#14120e] hover:bg-[#1f1616] text-[#c0b8ac] hover:text-[#e06666] font-bold px-6 py-4 rounded-2xl border border-[#2a2419] hover:border-[#8b2626]/60 shadow-md transition-all duration-200 cursor-pointer active:scale-98"
                id="hero-missed-button"
              >
                <div className="w-8 h-8 rounded-full bg-[#8b2626]/20 border border-[#8b2626]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <XCircle className="w-5 h-5 text-[#e06666]" />
                </div>
                <div className="text-right">
                  <span className="block text-base leading-tight">لم أتدرّب اليوم</span>
                  <span className="block text-xs text-[#e06666]/90 font-normal">تصفير العداد والبدء من اليوم 0</span>
                </div>
              </button>
            </div>

            <div className="mt-3 text-left">
              <button
                onClick={onOpenDetailedModal}
                className="text-xs text-[#c5a059] hover:text-[#e6ca85] font-bold underline underline-offset-4 cursor-pointer"
              >
                + تسجيل تفاصيل إضافية (الوقت، نوع التمرين، الملاحظات)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Stats Overview Cards */}
        <div className="w-full lg:w-80 grid grid-cols-2 lg:grid-cols-1 gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-r border-[#262118] lg:pr-6">
          
          {/* Longest Streak */}
          <div className="bg-[#14120e] rounded-2xl p-4 border border-[#241f17] flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#a09888] block font-medium">أطول سلسلة إنجاز</span>
              <span className="text-xl font-bold text-[#f5f0e6] font-['Amiri',serif]">
                {stats.longestStreak} <span className="text-xs font-normal text-[#a09888]">يوم متتالي</span>
              </span>
            </div>
          </div>

          {/* Total Exercised Days */}
          <div className="bg-[#14120e] rounded-2xl p-4 border border-[#241f17] flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#a09888] block font-medium">إجمالي التمارين</span>
              <span className="text-xl font-bold text-[#f5f0e6] font-['Amiri',serif]">
                {stats.totalExercised} <span className="text-xs font-normal text-[#a09888]">جلسة</span>
              </span>
            </div>
          </div>

          {/* Compliance Rate */}
          <div className="bg-[#14120e] rounded-2xl p-4 border border-[#241f17] flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#a09888] block font-medium">نسبة الانضباط</span>
              <span className="text-xl font-bold text-[#c5a059] font-['Amiri',serif]">
                %{stats.complianceRate}
              </span>
            </div>
          </div>

          {/* Last Exercised Date */}
          <div className="bg-[#14120e] rounded-2xl p-4 border border-[#241f17] flex items-center gap-3 col-span-2 lg:col-span-1">
            <div className="p-3 rounded-xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs text-[#a09888] block font-medium">آخر تمرين مسجل</span>
              <span className="text-xs font-bold text-[#f5f0e6] truncate block">
                {stats.lastExercisedDate ? formatArabicDate(stats.lastExercisedDate) : 'لم يتم التسجيل بعد'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

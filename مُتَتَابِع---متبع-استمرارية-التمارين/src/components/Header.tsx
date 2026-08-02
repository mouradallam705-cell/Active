import React from 'react';
import { Flame, Calendar, Quote, History, PlusCircle, Dumbbell, BarChart3, Settings } from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'calendar' | 'quotes' | 'history';
  setActiveTab: (tab: 'overview' | 'calendar' | 'quotes' | 'history') => void;
  currentStreak: number;
  onOpenLogModal: () => void;
  onOpenDataModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentStreak,
  onOpenLogModal,
  onOpenDataModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070707]/90 backdrop-blur-md border-b border-[#1f1b14] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo and App Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8a6d30] via-[#c5a059] to-[#e6ca85] flex items-center justify-center shadow-lg shadow-[#c5a059]/10 border border-[#c5a059]/40">
              <Dumbbell className="w-6 h-6 text-[#050505]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-[#f5f0e6] font-['Amiri',serif]">
                  مُتَتَابِع
                </h1>
                <span className="bg-[#c5a059]/10 text-[#c5a059] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#c5a059]/25">
                  متبع الاستمرارية
                </span>
              </div>
              <p className="text-xs text-[#a09888] hidden sm:block">
                تتبع أيام التزامك بالرياضة واصنع عادتك اليومية
              </p>
            </div>
          </div>

          {/* Quick Streak Indicator & Action Button */}
          <div className="flex items-center gap-3">
            
            {/* Streak Counter Pill */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-bold transition-all ${
              currentStreak > 0 
                ? 'bg-[#c5a059]/15 border-[#c5a059]/40 text-[#e6ca85] shadow-inner' 
                : 'bg-[#141414] border-[#222222] text-[#8c8577]'
            }`}>
              <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'text-[#c5a059] animate-pulse' : 'text-[#555555]'}`} />
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-[#f5f0e6]">{currentStreak}</span>
                <span className="text-xs text-[#c5a059]">يوم متتالي</span>
              </div>
            </div>

            {/* Quick Record Button */}
            <button
              onClick={onOpenLogModal}
              className="flex items-center gap-2 bg-gradient-to-r from-[#b38f46] via-[#c5a059] to-[#d4af37] hover:from-[#c5a059] hover:to-[#e6ca85] text-[#050505] font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-[#c5a059]/15 transition-all duration-200 cursor-pointer active:scale-95 text-sm"
              id="header-log-button"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden md:inline">تسجيل اليوم</span>
              <span className="md:hidden">تسجيل</span>
            </button>

            {/* Settings / Data Manage */}
            <button
              onClick={onOpenDataModal}
              title="إدارة البيانات والإعدادات"
              className="p-2.5 text-[#a09888] hover:text-[#f5f0e6] hover:bg-[#181818] rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[#2a261f]"
              id="header-settings-button"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-[#1a1712] no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#c5a059]/15 text-[#e6ca85] border border-[#c5a059]/35 shadow-sm'
                : 'text-[#9e9687] hover:text-[#f5f0e6] hover:bg-[#141414]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>نظرة عامة والعداد</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-[#c5a059]/15 text-[#e6ca85] border border-[#c5a059]/35 shadow-sm'
                : 'text-[#9e9687] hover:text-[#f5f0e6] hover:bg-[#141414]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>تقويم الاستمرارية</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'quotes'
                ? 'bg-[#c5a059]/15 text-[#e6ca85] border border-[#c5a059]/35 shadow-sm'
                : 'text-[#9e9687] hover:text-[#f5f0e6] hover:bg-[#141414]'
            }`}
          >
            <Quote className="w-4 h-4" />
            <span>الاقتباسات التحفيزية</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-[#c5a059]/15 text-[#e6ca85] border border-[#c5a059]/35 shadow-sm'
                : 'text-[#9e9687] hover:text-[#f5f0e6] hover:bg-[#141414]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>سجل النشاطات</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

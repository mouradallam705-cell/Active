import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StreakHeroCard } from './components/StreakHeroCard';
import { LogEntryModal } from './components/LogEntryModal';
import { CelebrationQuoteModal } from './components/CelebrationQuoteModal';
import { CalendarView } from './components/CalendarView';
import { QuotesGallery } from './components/QuotesGallery';
import { HistoryList } from './components/HistoryList';
import { DataManagementModal } from './components/DataManagementModal';

import { LogEntry, MotivationalQuote, EntryStatus } from './types';
import { INITIAL_QUOTES } from './data/initialQuotes';
import { generateSampleLogs } from './data/sampleLogs';
import { processLogsAndCalculateStats, getTodayDateString, getCurrentTimeString, formatArabicDate } from './utils/streakUtils';
import { Sparkles, CheckCircle2, Flame, Trophy, Calendar, Quote as QuoteIcon, ArrowUpRight, Dumbbell, Activity, ShieldCheck } from 'lucide-react';

const STORAGE_KEY_LOGS = 'mutatabi_exercise_logs_v1';
const STORAGE_KEY_QUOTES = 'mutatabi_custom_quotes_v1';
const STORAGE_KEY_BOOKMARKS = 'mutatabi_bookmarked_quotes_v1';

export default function App() {
  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'quotes' | 'history'>('overview');

  // Core Data State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [quotes, setQuotes] = useState<MotivationalQuote[]>(INITIAL_QUOTES);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Modals & UI Controls State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [logModalDefaultStatus, setLogModalDefaultStatus] = useState<EntryStatus>('exercised');

  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState<number>(1);
  const [celebrationQuote, setCelebrationQuote] = useState<MotivationalQuote | null>(null);

  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // Initialize Data from LocalStorage or Sample Logs
  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      if (savedLogs) {
        const parsedLogs: LogEntry[] = JSON.parse(savedLogs);
        setLogs(parsedLogs);
      } else {
        // Load realistic initial sample logs
        const sampleLogs = generateSampleLogs();
        setLogs(sampleLogs);
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(sampleLogs));
      }

      const savedQuotes = localStorage.getItem(STORAGE_KEY_QUOTES);
      if (savedQuotes) {
        const customQuotes: MotivationalQuote[] = JSON.parse(savedQuotes);
        setQuotes([...INITIAL_QUOTES, ...customQuotes]);
      }

      const savedBookmarks = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (savedBookmarks) {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      }
    } catch (err) {
      console.error('Error loading data from localStorage', err);
      setLogs(generateSampleLogs());
    }
  }, []);

  // Recalculate Streaks and Stats whenever logs change
  const { processedLogs, stats } = useMemo(() => {
    return processLogsAndCalculateStats(logs);
  }, [logs]);

  // Save logs to localStorage on updates
  const saveLogsToStorage = (updatedLogs: LogEntry[]) => {
    setLogs(updatedLogs);
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updatedLogs));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }
  };

  // Collect unlocked quotes from exercise entries
  const unlockedQuoteTexts = useMemo(() => {
    return processedLogs
      .filter((l) => l.status === 'exercised' && l.quoteUnlocked)
      .map((l) => l.quoteUnlocked as string);
  }, [processedLogs]);

  // Check today's log status
  const todayStr = getTodayDateString();
  const todayLog = useMemo(() => {
    return processedLogs.find((l) => l.date === todayStr);
  }, [processedLogs, todayStr]);

  // Save / Update Log Handler
  const handleSaveLog = (entryData: Omit<LogEntry, 'id' | 'streakCount'>) => {
    let newLogs = [...logs];
    let createdOrUpdatedLogId = editingLog ? editingLog.id : '';

    if (editingLog) {
      // Update existing
      newLogs = newLogs.map((l) => {
        if (l.id === editingLog.id) {
          return {
            ...l,
            ...entryData,
          };
        }
        return l;
      });
    } else {
      // Check if entry for this date already exists
      const existingDateIdx = newLogs.findIndex((l) => l.date === entryData.date);
      const newId = `entry-${Date.now()}`;
      createdOrUpdatedLogId = newId;

      if (existingDateIdx >= 0) {
        // Overwrite entry for same date
        newLogs[existingDateIdx] = {
          ...newLogs[existingDateIdx],
          ...entryData,
        };
      } else {
        // Create new entry
        const newEntry: LogEntry = {
          id: newId,
          streakCount: 0, // will be computed in processLogsAndCalculateStats
          ...entryData,
        };
        newLogs.push(newEntry);
      }
    }

    // Process updated logs to get recalculated streaks
    const { processedLogs: newlyProcessed, stats: newlyStats } = processLogsAndCalculateStats(newLogs);
    saveLogsToStorage(newLogs);

    // If recorded as "exercised", show celebration quote modal!
    if (entryData.status === 'exercised') {
      const activeLog = newlyProcessed.find((l) => l.date === entryData.date) || newlyProcessed[0];
      const newStreakVal = activeLog ? activeLog.streakCount : newlyStats.currentStreak;

      // Select a quote
      const randomQuote = getRandomQuote();
      
      // Save quote text to entry if not already set
      if (activeLog && !activeLog.quoteUnlocked && randomQuote) {
        const updatedWithQuote = newLogs.map((l) => {
          if (l.id === activeLog.id) {
            return { ...l, quoteUnlocked: randomQuote.text };
          }
          return l;
        });
        saveLogsToStorage(updatedWithQuote);
      }

      setCelebrationStreak(newStreakVal);
      setCelebrationQuote(randomQuote);
      setIsCelebrationModalOpen(true);
    } else {
      // Alert reset
      alert('تم تسجيل يوم توقف. تم إعادة العداد إلى اليوم صفر (0) بنجاح.');
    }

    setEditingLog(null);
  };

  // Quick 1-Click Log Today as Exercised
  const handleQuickLogExercised = () => {
    handleSaveLog({
      date: getTodayDateString(),
      time: getCurrentTimeString(),
      status: 'exercised',
      workoutType: 'تمرين عام',
      durationMinutes: 45,
      notes: 'تم تسجيل التزام اليوم بلمسة واحدة!',
    });
  };

  // Quick 1-Click Log Today as Missed
  const handleQuickLogMissed = () => {
    if (confirm('هل أنت متأكد من تسجيل "لم أتدرّب اليوم"؟ سوف يتم تصفير العداد إلى اليوم 0.')) {
      handleSaveLog({
        date: getTodayDateString(),
        time: getCurrentTimeString(),
        status: 'missed',
        notes: 'توقف عن التمرين اليوم - تصفير العداد والبدء مجدداً من اليوم 0',
      });
    }
  };

  // Select Date From Calendar to Log/Edit
  const handleSelectDateToLog = (dateStr: string) => {
    setEditingLog(null);
    setLogModalDefaultStatus('exercised');
    setIsLogModalOpen(true);
  };

  // Delete Log
  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    saveLogsToStorage(updated);
  };

  // Get Random Quote
  const getRandomQuote = (): MotivationalQuote => {
    const idx = Math.floor(Math.random() * quotes.length);
    return quotes[idx] || INITIAL_QUOTES[0];
  };

  // Toggle Bookmark Quote
  const handleToggleBookmark = (quote: MotivationalQuote) => {
    let updated: string[];
    if (bookmarkedIds.includes(quote.id)) {
      updated = bookmarkedIds.filter((id) => id !== quote.id);
    } else {
      updated = [...bookmarkedIds, quote.id];
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Add Custom Quote
  const handleAddCustomQuote = (newQuoteData: Omit<MotivationalQuote, 'id'>) => {
    const newQuote: MotivationalQuote = {
      id: `custom-${Date.now()}`,
      ...newQuoteData,
    };
    const updatedQuotes = [...quotes, newQuote];
    setQuotes(updatedQuotes);

    // Save custom quotes to localStorage
    const customOnly = updatedQuotes.filter((q) => q.isCustom);
    localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(customOnly));
  };

  // Reset to Sample Data
  const handleResetToSampleData = () => {
    const sampleLogs = generateSampleLogs();
    saveLogsToStorage(sampleLogs);
    setActiveTab('overview');
  };

  // Clear All Data
  const handleClearAllData = () => {
    saveLogsToStorage([]);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f0e6] flex flex-col font-['Amiri',serif]">
      
      {/* Top Header & Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStreak={stats.currentStreak}
        onOpenLogModal={() => {
          setEditingLog(null);
          setLogModalDefaultStatus('exercised');
          setIsLogModalOpen(true);
        }}
        onOpenDataModal={() => setIsDataModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TAB 1: OVERVIEW & STREAK DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Primary Hero Streak Counter Card */}
            <StreakHeroCard
              stats={stats}
              onQuickLogExercised={handleQuickLogExercised}
              onQuickLogMissed={handleQuickLogMissed}
              onOpenDetailedModal={() => {
                setEditingLog(null);
                setLogModalDefaultStatus('exercised');
                setIsLogModalOpen(true);
              }}
              hasLoggedToday={!!todayLog}
              todayLogStatus={todayLog?.status}
            />

            {/* Quick Insights & Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Recent Logged Activity Preview */}
              <div className="lg:col-span-2 bg-[#0e0d0b] border border-[#2a2419] rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#221d15] pb-4">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-[#c5a059]" />
                    <h3 className="text-lg font-black text-[#f5f0e6] font-['Amiri',serif]">
                      آخر النشاطات المسجلة
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-bold text-[#c5a059] hover:text-[#e6ca85] flex items-center gap-1 cursor-pointer"
                  >
                    <span>عرض السجل الكامل ({processedLogs.length})</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Short list of top 4 recent logs */}
                {processedLogs.length === 0 ? (
                  <div className="text-center py-8 text-[#a09888] space-y-2">
                    <p className="text-sm font-bold">لم تسجل أي أيام بعد</p>
                    <p className="text-xs">اضغط على &quot;تمرّنت اليوم&quot; للبدء بإنشاء سلسلتك الأولى!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {processedLogs.slice(0, 4).map((log) => (
                      <div
                        key={log.id}
                        onClick={() => {
                          setEditingLog(log);
                          setIsLogModalOpen(true);
                        }}
                        className="flex items-center justify-between p-3.5 bg-[#14120e] hover:bg-[#1a1713] border border-[#262118] rounded-2xl transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            log.status === 'exercised' ? 'bg-[#c5a059] shadow-sm shadow-[#c5a059]/50' : 'bg-[#e06666]'
                          }`} />
                          <div>
                            <span className="text-sm font-bold text-[#f5f0e6] block">
                              {formatArabicDate(log.date)}
                            </span>
                            <span className="text-xs text-[#a09888]">
                              {log.status === 'exercised' ? (log.workoutType || 'تمرين مكتمل') : 'لم يتدرّب (تصفير)'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black bg-[#0e0d0b] px-2.5 py-1 rounded-lg border border-[#2a2419] text-[#e6ca85] flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-[#c5a059]" />
                            <span>اليوم {log.streakCount}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right 1 Col: Featured Motivational Quote of the Day */}
              <div className="bg-gradient-to-b from-[#0e0d0b] to-[#0a0907] border border-[#2a2419] rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25 px-3 py-1 rounded-full flex items-center gap-1">
                      <QuoteIcon className="w-3.5 h-3.5" />
                      <span>حكمة اليوم التحفيزية</span>
                    </span>
                    <Sparkles className="w-4 h-4 text-[#c5a059]" />
                  </div>

                  {quotes.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-base font-bold text-[#f5f0e6] leading-relaxed font-['Amiri',serif]">
                        « {quotes[0].text} »
                      </p>
                      <p className="text-xs text-[#a09888] text-left font-semibold">
                        — {quotes[0].author || 'حكمة اللياقة'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#221d15]">
                  <button
                    onClick={() => setActiveTab('quotes')}
                    className="w-full bg-[#14120e] hover:bg-[#1a1713] text-[#f5f0e6] font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-[#262118]"
                  >
                    <span>استعرض كافة الاقتباسات والمفضلات</span>
                    <ArrowUpRight className="w-4 h-4 text-[#c5a059]" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: CALENDAR VIEW */}
        {activeTab === 'calendar' && (
          <div className="animate-in fade-in duration-300">
            <CalendarView
              logs={processedLogs}
              onSelectDateToLog={handleSelectDateToLog}
              onEditLog={(log) => {
                setEditingLog(log);
                setIsLogModalOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 3: MOTIVATIONAL QUOTES GALLERY */}
        {activeTab === 'quotes' && (
          <div className="animate-in fade-in duration-300">
            <QuotesGallery
              quotes={quotes}
              bookmarkedIds={bookmarkedIds}
              unlockedQuoteTexts={unlockedQuoteTexts}
              onToggleBookmark={handleToggleBookmark}
              onAddCustomQuote={handleAddCustomQuote}
            />
          </div>
        )}

        {/* TAB 4: HISTORY LIST */}
        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-300">
            <HistoryList
              logs={processedLogs}
              onEditLog={(log) => {
                setEditingLog(log);
                setIsLogModalOpen(true);
              }}
              onDeleteLog={handleDeleteLog}
              onOpenLogModal={() => {
                setEditingLog(null);
                setLogModalDefaultStatus('exercised');
                setIsLogModalOpen(true);
              }}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#0e0d0b]/80 border-t border-[#221d15] py-6 mt-12 text-center text-xs text-[#a09888] space-y-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            <span className="font-bold text-[#f5f0e6]">مُتَتَابِع - تطبيق تتبع الاستمرارية الرياضية</span>
          </div>
          <p className="text-[#a09888]">
            صنع لمساعدتك على الالتزام اليومي وإيقاف التسويف
          </p>
        </div>
      </footer>

      {/* MODALS */}
      
      {/* Log Entry / Edit Modal */}
      <LogEntryModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSave={handleSaveLog}
        initialEntry={editingLog}
        defaultStatus={logModalDefaultStatus}
      />

      {/* Celebration Quote Modal */}
      <CelebrationQuoteModal
        isOpen={isCelebrationModalOpen}
        onClose={() => setIsCelebrationModalOpen(false)}
        streakCount={celebrationStreak}
        quote={celebrationQuote}
        onRefreshQuote={() => setCelebrationQuote(getRandomQuote())}
        onBookmarkQuote={handleToggleBookmark}
        isBookmarked={celebrationQuote ? bookmarkedIds.includes(celebrationQuote.id) : false}
      />

      {/* Data Management Modal */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        logs={processedLogs}
        quotes={quotes}
        onImportLogs={(imported) => saveLogsToStorage(imported)}
        onResetToSampleData={handleResetToSampleData}
        onClearAllData={handleClearAllData}
      />

    </div>
  );
}

export type EntryStatus = 'exercised' | 'missed';

export type WorkoutType = 
  | 'حديد / أثقال'
  | 'كارديو'
  | 'جري'
  | 'مشي سريع'
  | 'سباحة'
  | 'دراجة'
  | 'لياقة بدنية / سويدي'
  | 'يوغا / إطالات'
  | 'رياضة أخرى';

export interface LogEntry {
  id: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:mm
  status: EntryStatus;
  workoutType?: WorkoutType | string;
  durationMinutes?: number;
  notes?: string;
  streakCount: number; // Streak number calculated up to and including this entry
  quoteUnlocked?: string; // Quote displayed upon logging this exercise
}

export interface MotivationalQuote {
  id: string;
  text: string;
  author?: string;
  category: 'انضباط' | 'استمرارية' | 'تغلب على التكاسل' | 'صحة وقوة' | 'إنجاز';
  isCustom?: boolean;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysLogged: number;
  totalExercised: number;
  totalMissed: number;
  complianceRate: number; // percentage 0 - 100
  lastExercisedDate?: string;
}

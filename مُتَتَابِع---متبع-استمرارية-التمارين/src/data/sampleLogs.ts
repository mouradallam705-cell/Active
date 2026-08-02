import { LogEntry } from '../types';

export function generateSampleLogs(): LogEntry[] {
  const today = new Date();
  
  const formatDateStr = (offsetDays: number): string => {
    const d = new Date(today);
    d.setDate(d.getDate() - offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // We build a timeline starting 14 days ago up to yesterday/today
  // Timeline:
  // Day -13: Exercised (Streak 1)
  // Day -12: Exercised (Streak 2)
  // Day -11: Exercised (Streak 3)
  // Day -10: Exercised (Streak 4)
  // Day -9:  Missed    (Streak 0 - RESET!)
  // Day -8:  Exercised (Streak 1)
  // Day -7:  Exercised (Streak 2)
  // Day -6:  Exercised (Streak 3)
  // Day -5:  Exercised (Streak 4)
  // Day -4:  Exercised (Streak 5)
  // Day -3:  Exercised (Streak 6)
  // Day -2:  Exercised (Streak 7)
  // Day -1:  Exercised (Streak 8)
  // Day 0:   Exercised (Streak 9)

  const logs: LogEntry[] = [
    {
      id: 'sample-14',
      date: formatDateStr(13),
      time: '18:30',
      status: 'exercised',
      workoutType: 'حديد / أثقال',
      durationMinutes: 50,
      notes: 'تمارين الصدر والترايسبس، تركيز ممتاز',
      streakCount: 1,
      quoteUnlocked: 'الاستمرارية هِي السحر الحقيقي؛ خطوة صغيرة كل يوم تصنع الجبال غداً.'
    },
    {
      id: 'sample-13',
      date: formatDateStr(12),
      time: '19:00',
      status: 'exercised',
      workoutType: 'كارديو',
      durationMinutes: 35,
      notes: 'جري خفيف على الجهاز وتبريد 10 دقائق',
      streakCount: 2,
      quoteUnlocked: 'لا تنتظر الشغف أو المزاج الجيد ليتحرك؛ تصنّع الانضباط وسوف يلحق بك الشغف.'
    },
    {
      id: 'sample-12',
      date: formatDateStr(11),
      time: '17:45',
      status: 'exercised',
      workoutType: 'حديد / أثقال',
      durationMinutes: 60,
      notes: 'تمارين الظهر والبايسبس مع زيادة أوزان تدريجية',
      streakCount: 3,
      quoteUnlocked: 'ألم التدريب مؤقت ويزول بانتهاء الجلسة، لكن ألم الندم على التفريط يمتد طويلاً.'
    },
    {
      id: 'sample-11',
      date: formatDateStr(10),
      time: '20:15',
      status: 'exercised',
      workoutType: 'لياقة بدنية / سويدي',
      durationMinutes: 40,
      notes: 'تمارين بطن وضغط ولياقة بدنية في المنزل',
      streakCount: 4,
      quoteUnlocked: 'جسمك هو المنزل الوحيد الذي ستعيش فيه طوال حياتك، استثمر في العناية به يومياً.'
    },
    {
      id: 'sample-10',
      date: formatDateStr(9),
      time: '22:00',
      status: 'missed',
      notes: 'انشغال بالسفر والعمل، لم أتدرّب اليوم - إعادة العداد لليوم 0',
      streakCount: 0,
    },
    {
      id: 'sample-9',
      date: formatDateStr(8),
      time: '18:00',
      status: 'exercised',
      workoutType: 'مشي سريع',
      durationMinutes: 45,
      notes: 'العودة بعد يوم التوقف! بدء سلسلة جديدة بإنعاش القوة',
      streakCount: 1,
      quoteUnlocked: 'معركة اليوم ليست ضد الأثقال أو الطريق، بل ضد صوت الكسل الداخلي.'
    },
    {
      id: 'sample-8',
      date: formatDateStr(7),
      time: '17:30',
      status: 'exercised',
      workoutType: 'حديد / أثقال',
      durationMinutes: 55,
      notes: 'تمارين الأرجل والأكتاف بكل طاقة',
      streakCount: 2,
      quoteUnlocked: 'كل نقطة عرق تسقط اليوم هي لَبِنة في جدار قوتك وصحتك.'
    },
    {
      id: 'sample-7',
      date: formatDateStr(6),
      time: '19:10',
      status: 'exercised',
      workoutType: 'سباحة',
      durationMinutes: 45,
      notes: 'تمارين سباحة واستشفاء عضلي',
      streakCount: 3,
      quoteUnlocked: 'الفرق بين الشخص الذي ينجح والأخرين ليس نقص القوة بل نقص الإرادة.'
    },
    {
      id: 'sample-6',
      date: formatDateStr(5),
      time: '18:45',
      status: 'exercised',
      workoutType: 'كارديو',
      durationMinutes: 40,
      notes: 'تمارين دراجة ثابتة وتدريب متواتر HIIT',
      streakCount: 4,
      quoteUnlocked: 'إن لم تدفع نفسك اليوم للنهاية، فمن سيفعل ذلك نيابة عنك؟'
    },
    {
      id: 'sample-5',
      date: formatDateStr(4),
      time: '17:00',
      status: 'exercised',
      workoutType: 'حديد / أثقال',
      durationMinutes: 60,
      notes: 'جلسة دفع علوية (صدر وأكتاف)',
      streakCount: 5,
      quoteUnlocked: 'اليوم الذي تتمرن فيه وأنت لا تشعر بالرغبة هو اليوم الذي تنمو فيه شخصيتك.'
    },
    {
      id: 'sample-4',
      date: formatDateStr(3),
      time: '18:20',
      status: 'exercised',
      workoutType: 'جري',
      durationMinutes: 30,
      notes: 'جري 5 كيلومتر في الهواء الطلق',
      streakCount: 6,
      quoteUnlocked: 'لا تقارن بدايتك بموسم حصاد الآخرين؛ قارن نفسك بين اليوم والأمس فقط.'
    },
    {
      id: 'sample-3',
      date: formatDateStr(2),
      time: '19:30',
      status: 'exercised',
      workoutType: 'حديد / أثقال',
      durationMinutes: 50,
      notes: 'جلسة سحب (ظهر وبايسبس)',
      streakCount: 7,
      quoteUnlocked: 'ساعة واحدة من الرياضة تمثل 4% فقط من يومك؛ لا توجد أعذار.'
    },
    {
      id: 'sample-2',
      date: formatDateStr(1),
      time: '18:00',
      status: 'exercised',
      workoutType: 'لياقة بدنية / سويدي',
      durationMinutes: 40,
      notes: 'تمارين مرونة ولياقة بالوزن الحر',
      streakCount: 8,
      quoteUnlocked: 'النجاح الرياضي ليس حدثاً مفاجئاً، بل عادة يومية تتراكم أرباحها.'
    },
    {
      id: 'sample-1',
      date: formatDateStr(0),
      time: '17:15',
      status: 'exercised',
      workoutType: 'حديد / أثقال',
      durationMinutes: 60,
      notes: 'تمارين أرجل وبطن شاقة، وصول إلى اليوم الـ 9 متتالي!',
      streakCount: 9,
      quoteUnlocked: 'كل تمرين تنهيه بنجاح هو نصر صغير يرفع مستوى ثقتك بنفسك.'
    }
  ];

  return logs;
}

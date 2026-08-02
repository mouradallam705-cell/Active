import React, { useState } from 'react';
import { Quote, Sparkles, Bookmark, Copy, Check, Plus, Search, Filter, Share2 } from 'lucide-react';
import { MotivationalQuote } from '../types';

interface QuotesGalleryProps {
  quotes: MotivationalQuote[];
  bookmarkedIds: string[];
  unlockedQuoteTexts: string[];
  onToggleBookmark: (quote: MotivationalQuote) => void;
  onAddCustomQuote: (newQuote: Omit<MotivationalQuote, 'id'>) => void;
}

export const QuotesGallery: React.FC<QuotesGalleryProps> = ({
  quotes,
  bookmarkedIds,
  unlockedQuoteTexts,
  onToggleBookmark,
  onAddCustomQuote,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Quote Modal Form state
  const [isAddingQuote, setIsAddingQuote] = useState(false);
  const [newText, setNewText] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState<MotivationalQuote['category']>('انضباط');

  const categories = ['الكل', 'المفضلات', 'مفتوحة بالتمارين', 'انضباط', 'استمرارية', 'تغلب على التكاسل', 'صحة وقوة', 'إنجاز'];

  const filteredQuotes = quotes.filter((q) => {
    // Category Filter
    if (selectedCategory === 'المفضلات') {
      if (!bookmarkedIds.includes(q.id)) return false;
    } else if (selectedCategory === 'مفتوحة بالتمارين') {
      if (!unlockedQuoteTexts.includes(q.text)) return false;
    } else if (selectedCategory !== 'الكل') {
      if (q.category !== selectedCategory) return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchText = q.text.toLowerCase().includes(query);
      const matchAuthor = (q.author || '').toLowerCase().includes(query);
      return matchText || matchAuthor;
    }

    return true;
  });

  const handleCopy = (quote: MotivationalQuote) => {
    const textToCopy = `"${quote.text}"\n— ${quote.author || 'مُتَتَابِع'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveNewQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddCustomQuote({
      text: newText.trim(),
      author: newAuthor.trim() || 'اقتباس شخصي',
      category: newCategory,
      isCustom: true,
    });
    setNewText('');
    setNewAuthor('');
    setIsAddingQuote(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0e0d0b] via-[#14120e] to-[#0e0d0b] border border-[#2a2419] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/25 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>حافزك اليومي للاستمرار</span>
          </div>
          <h2 className="text-2xl font-black text-[#f5f0e6] font-['Amiri',serif]">
            قسم الاقتباسات التحفيزية
          </h2>
          <p className="text-sm text-[#a09888]">
            مجموعة مختارة من الحكم والعبارات المشجعة المخصصة لتعزيز إرادتك، والتي تظهر لك بعد كل تمرين ناجح تسجله.
          </p>
        </div>

        <button
          onClick={() => setIsAddingQuote(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#b38f46] via-[#c5a059] to-[#d4af37] hover:from-[#c5a059] hover:to-[#e6ca85] text-[#050505] font-black px-5 py-3 rounded-2xl shadow-lg shadow-[#c5a059]/15 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة اقتباس تحفيزي</span>
        </button>
      </div>

      {/* Search & Category Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0e0d0b] p-4 rounded-3xl border border-[#262118]">
        
        {/* Categories scrollable pill row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#c5a059] text-[#050505] shadow-md shadow-[#c5a059]/20'
                    : 'bg-[#14120e] text-[#a09888] hover:text-[#f5f0e6] border border-[#262118]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-56">
          <Search className="w-4 h-4 text-[#a09888] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث في الاقتباسات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#14120e] border border-[#2a2419] rounded-xl pr-10 pl-3 py-2 text-xs text-[#f5f0e6] placeholder:text-[#6e6659] focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>
      </div>

      {/* Quotes Cards Grid */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-[#0e0d0b]/60 border border-[#221d15] rounded-3xl p-12 text-center space-y-3">
          <Quote className="w-12 h-12 text-[#554d40] mx-auto" />
          <h3 className="text-lg font-bold text-[#f5f0e6] font-['Amiri',serif]">لا توجد اقتباسات مطابقة</h3>
          <p className="text-xs text-[#a09888]">
            جرّب تغيير فئة التصفية أو البحث، أو أضف اقتباسك الخاص!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuotes.map((quote) => {
            const isBookmarked = bookmarkedIds.includes(quote.id);
            const isUnlocked = unlockedQuoteTexts.includes(quote.text);

            return (
              <div
                key={quote.id}
                className="group relative bg-[#0e0d0b] hover:bg-[#14120e] border border-[#241f17] hover:border-[#c5a059]/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all duration-200"
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold bg-[#171410] text-[#c5a059] px-2.5 py-1 rounded-lg border border-[#2a2419]">
                    {quote.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isUnlocked && (
                      <span className="text-[10px] font-bold bg-[#c5a059]/20 text-[#e6ca85] px-2 py-0.5 rounded-full border border-[#c5a059]/30">
                        مفتوح بعد التمرين 🏋️‍♂️
                      </span>
                    )}

                    {quote.isCustom && (
                      <span className="text-[10px] font-bold bg-[#8a6d30]/20 text-[#e6ca85] px-2 py-0.5 rounded-full border border-[#8a6d30]/30">
                        إضافتك الخاصة
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Quote Text */}
                <p className="text-base font-bold text-[#f5f0e6] leading-relaxed font-['Amiri',serif]">
                  « {quote.text} »
                </p>

                {/* Author & Footer Actions */}
                <div className="pt-3 border-t border-[#221d15] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#a09888]">
                    — {quote.author || 'حكمة رياضية'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(quote)}
                      title="نسخ النص"
                      className="p-2 text-[#a09888] hover:text-[#f5f0e6] bg-[#14120e] rounded-lg border border-[#262118] transition-colors cursor-pointer"
                    >
                      {copiedId === quote.id ? (
                        <Check className="w-4 h-4 text-[#c5a059]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => onToggleBookmark(quote)}
                      title={isBookmarked ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-[#c5a059]/20 text-[#e6ca85] border-[#c5a059]/40'
                          : 'bg-[#14120e] text-[#a09888] hover:text-[#f5f0e6] border-[#262118]'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#c5a059] text-[#c5a059]' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Adding Custom Quote */}
      {isAddingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0e0d0b] border border-[#2a2419] rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#f5f0e6] font-['Amiri',serif]">
              إضافة اقتباس تحفيزي جديد
            </h3>

            <form onSubmit={handleSaveNewQuote} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#a09888] block">نص الاقتباس:</label>
                <textarea
                  required
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="اكتب العبارة أو الاقتباس التحفيزي..."
                  className="w-full bg-[#14120e] border border-[#2a2419] rounded-xl p-3 text-[#f5f0e6] text-sm focus:outline-none focus:border-[#c5a059] transition-colors resize-none font-['Amiri',serif]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#a09888] block">القائل / المصدر (اختياري):</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="مثال: علي بن أبي طالب / جيم رون / حكمة شخصية"
                  className="w-full bg-[#14120e] border border-[#2a2419] rounded-xl px-3.5 py-2 text-[#f5f0e6] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#a09888] block">التصنيف:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as MotivationalQuote['category'])}
                  className="w-full bg-[#14120e] border border-[#2a2419] rounded-xl px-3.5 py-2 text-[#f5f0e6] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
                >
                  <option value="انضباط">انضباط</option>
                  <option value="استمرارية">استمرارية</option>
                  <option value="تغلب على التكاسل">تغلب على التكاسل</option>
                  <option value="صحة وقوة">صحة وقوة</option>
                  <option value="إنجاز">إنجاز</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingQuote(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#a09888] hover:bg-[#1a1713] transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#c5a059] hover:bg-[#e6ca85] text-[#050505] font-black px-5 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  حفظ الاقتباس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

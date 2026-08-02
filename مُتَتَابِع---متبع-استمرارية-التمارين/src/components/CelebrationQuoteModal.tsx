import React, { useState } from 'react';
import { Trophy, Flame, Quote, Copy, Check, Bookmark, Sparkles, RefreshCw, X } from 'lucide-react';
import { MotivationalQuote } from '../types';

interface CelebrationQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakCount: number;
  quote: MotivationalQuote | null;
  onRefreshQuote?: () => void;
  onBookmarkQuote?: (quote: MotivationalQuote) => void;
  isBookmarked?: boolean;
}

export const CelebrationQuoteModal: React.FC<CelebrationQuoteModalProps> = ({
  isOpen,
  onClose,
  streakCount,
  quote,
  onRefreshQuote,
  onBookmarkQuote,
  isBookmarked = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!quote) return;
    const textToCopy = `"${quote.text}"\n— ${quote.author || 'مُتَتَابِع'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-[#0e0d0b] to-[#070605] border border-[#c5a059]/35 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#c5a059]/10 space-y-6 my-8 text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-[#a09888] hover:text-[#f5f0e6] bg-[#14120e] rounded-xl border border-[#262118] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy & Badge Icon */}
        <div className="pt-2 flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#b38f46] via-[#c5a059] to-[#d4af37] flex items-center justify-center shadow-xl shadow-[#c5a059]/20 border border-[#e6ca85]/40 transform hover:scale-105 transition-transform">
              <Trophy className="w-10 h-10 text-[#050505]" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#c5a059] text-[#050505] font-black p-1.5 rounded-full border-2 border-[#050505]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-[#f5f0e6] font-['Amiri',serif] mt-4">
            أحسنت بطل اليوم! 🎉
          </h2>
          <p className="text-sm text-[#a09888] mt-1">
            تم تسجيل تمرينك بنجاح، واستمرت سلسلتك المذهلة!
          </p>

          {/* New Streak Counter Pill */}
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#e6ca85] font-bold text-sm shadow-inner">
            <Flame className="w-4 h-4 text-[#c5a059] animate-bounce" />
            <span>وصلت إلى اليوم الـ <strong className="text-lg font-black font-['Amiri',serif]">{streakCount}</strong> متتالي!</span>
          </div>
        </div>

        {/* Motivational Quote Card */}
        {quote && (
          <div className="relative bg-[#14120e] border border-[#2a2419] rounded-2xl p-5 text-right space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#262118] pb-2">
              <span className="text-xs font-bold text-[#c5a059] flex items-center gap-1">
                <Quote className="w-3.5 h-3.5" />
                <span>اقتباسك التحفيزي لهذا التمرين:</span>
              </span>
              <span className="text-[10px] bg-[#0e0d0b] text-[#a09888] px-2 py-0.5 rounded-md border border-[#2a2419]">
                {quote.category}
              </span>
            </div>

            <p className="text-base font-bold text-[#f5f0e6] leading-relaxed font-['Amiri',serif]">
              « {quote.text} »
            </p>

            {quote.author && (
              <p className="text-xs font-semibold text-[#a09888] text-left">
                — {quote.author}
              </p>
            )}

            {/* Card Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#221d15]">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-[#a09888] hover:text-[#f5f0e6] bg-[#0e0d0b] hover:bg-[#1a1713] px-3 py-1.5 rounded-lg border border-[#262118] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#c5a059]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                </button>

                {onBookmarkQuote && (
                  <button
                    onClick={() => onBookmarkQuote(quote)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isBookmarked
                        ? 'bg-[#c5a059]/20 text-[#e6ca85] border-[#c5a059]/40'
                        : 'bg-[#0e0d0b] text-[#a09888] hover:text-[#f5f0e6] border-[#262118]'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#c5a059] text-[#c5a059]' : ''}`} />
                    <span>{isBookmarked ? 'محفوظ' : 'حفظ'}</span>
                  </button>
                )}
              </div>

              {onRefreshQuote && (
                <button
                  onClick={onRefreshQuote}
                  title="اقتباس جديد"
                  className="p-1.5 text-[#a09888] hover:text-[#c5a059] bg-[#0e0d0b] rounded-lg border border-[#262118] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-[#b38f46] via-[#c5a059] to-[#d4af37] hover:from-[#c5a059] hover:to-[#e6ca85] text-[#050505] font-black py-3.5 rounded-xl shadow-xl shadow-[#c5a059]/15 text-base transition-all cursor-pointer active:scale-98"
        >
          متابعة رحلة الالتزام 💪
        </button>
      </div>
    </div>
  );
};

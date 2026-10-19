import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Copy, 
  Check, 
  Plus, 
  Hash, 
  SlidersHorizontal 
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const TokensPanel: React.FC = () => {
  const { tokens, setActiveTab, setActiveAgentRole, sendAgentPrompt } = useStudio();
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'color' | 'typography' | 'spacing'>('all');

  const filteredTokens = activeCategory === 'all' 
    ? tokens 
    : tokens.filter(t => t.category === activeCategory);

  const handleExportTokensJson = () => {
    const tokenObj: Record<string, string> = {};
    tokens.forEach(t => {
      tokenObj[t.key] = t.value;
    });
    navigator.clipboard.writeText(JSON.stringify(tokenObj, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeepSeekPalette = () => {
    setActiveAgentRole('tokens');
    setActiveTab('ai');
    sendAgentPrompt('قم بتوليد نظام رموز تصميم (Design Tokens) متكامل وعصري بأسلوب داكن احترافي، مع تدرجات الألوان المتناسقة ومقاييس الخطوط.');
  };

  return (
    <div className="w-80 bg-studio-panel border-r border-studio-border flex flex-col h-full select-none z-10 text-xs">
      {/* Header */}
      <div className="p-3 border-b border-studio-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <span className="font-semibold uppercase tracking-wide text-white">نظم التصميم والرموز (Design Tokens)</span>
        </div>
        <button
          onClick={handleExportTokensJson}
          className="flex items-center gap-1 px-2 py-1 rounded bg-studio-subpanel hover:bg-studio-hover border border-studio-border text-[11px] text-white transition active:scale-95"
          title="نسخ رموز التصميم بصيغة JSON"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-studio-muted" />}
          <span>{copied ? 'تم النسخ!' : 'تصدير JSON'}</span>
        </button>
      </div>

      {/* Filter Category pills */}
      <div className="p-3 border-b border-studio-border flex items-center gap-1.5">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'color', label: 'الألوان' },
          { id: 'typography', label: 'الخطوط' },
          { id: 'spacing', label: 'المسافات' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-2.5 py-1 rounded-md text-[11px] transition font-medium ${
              activeCategory === cat.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-studio-muted hover:text-white bg-studio-subpanel'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Token List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredTokens.map(tok => (
          <div 
            key={tok.id}
            className="p-2.5 rounded-lg bg-studio-subpanel/70 border border-studio-border flex items-center justify-between hover:border-studio-accent/40 transition group"
          >
            <div className="flex items-center gap-2.5">
              {tok.category === 'color' && (
                <div 
                  className="w-6 h-6 rounded-md border border-studio-border shadow-sm flex-shrink-0"
                  style={{ backgroundColor: tok.value }}
                />
              )}
              {tok.category === 'typography' && (
                <div className="w-6 h-6 rounded-md bg-studio-bg border border-studio-border flex items-center justify-center text-[10px] font-bold text-amber-400 flex-shrink-0">
                  Ag
                </div>
              )}
              {tok.category === 'spacing' && (
                <div className="w-6 h-6 rounded-md bg-studio-bg border border-studio-border flex items-center justify-center text-[10px] font-mono text-cyan-400 flex-shrink-0">
                  px
                </div>
              )}

              <div className="min-w-0">
                <span className="font-medium text-white block text-[11px] truncate">{tok.name}</span>
                <span className="text-[10px] font-mono text-studio-muted truncate block">{tok.key}</span>
              </div>
            </div>

            <span className="font-mono text-[11px] text-studio-text bg-studio-bg/60 px-1.5 py-0.5 rounded border border-studio-border/50">
              {tok.value}
            </span>
          </div>
        ))}

        {/* DeepSeek Tokens Assistant Card */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-950/40 to-pink-950/30 border border-purple-500/30 space-y-2 mt-4">
          <div className="flex items-center gap-1.5 text-purple-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-studio-accent" />
            <span>توليد وتناسق الرموز بواسطة DeepSeek</span>
          </div>
          <p className="text-[11px] text-studio-muted leading-relaxed">
            دع وكيل ديب سيك يصمم لك لوحة ألوان دلالية (Semantic Colors) ومقاييس فراغات هندسية متوازنة.
          </p>
          <button
            onClick={handleDeepSeekPalette}
            className="w-full py-1.5 rounded-md bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-medium transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>توليد لوحة ألوان جديدة</span>
          </button>
        </div>
      </div>
    </div>
  );
};

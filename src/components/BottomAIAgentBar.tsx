import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Settings, 
  MessageSquare, 
  Check, 
  Bot, 
  User, 
  HelpCircle,
  Code2,
  Trash2,
  PlusCircle
} from 'lucide-react';
import { useStudio, AI_AGENTS } from '../context/StudioContext';
import { AIAgentRole } from '../types';

interface BottomAIAgentBarProps {
  onOpenSettings: () => void;
}

export const BottomAIAgentBar: React.FC<BottomAIAgentBarProps> = ({ onOpenSettings }) => {
  const { 
    activeAgent, 
    setActiveAgentRole, 
    chatMessages, 
    sendAgentPrompt, 
    isAgentGenerating, 
    autoApplyAI, 
    setAutoApplyAI,
    isAIBottomBarExpanded,
    setIsAIBottomBarExpanded,
    deepSeekConfig,
    clearChat,
    applyAgentNodes,
    lastAppliedNotification
  } = useStudio();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLiveKey = !!deepSeekConfig.apiKey && deepSeekConfig.apiKey.trim().length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to bottom when expanded messages change
  useEffect(() => {
    if (isAIBottomBarExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAIBottomBarExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isAgentGenerating) return;
    const p = inputPrompt;
    setInputPrompt('');
    sendAgentPrompt(p);
  };

  const quickPromptsByRole: Record<AIAgentRole, string[]> = {
    code: [
      'اكتب كود بطاقة تسعير احترافية بـ Tailwind',
      'صمم زر نيون متدرج تفاعلي بكود حي',
      'أنشئ واجهة تسجيل دخول داكنة مطبقة فوراً',
      'ولد بطاقة إحصاءات مالية KPI حية'
    ],
    architect: [
      'صمم واجهة تسجيل دخول حديثة',
      'أنشئ بطاقة مؤشرات أداء KPI',
      'صمم بطاقة ميزة تفاعلية للمتجهات'
    ],
    tokens: [
      'ولد لوحة ألوان نيون داكنة متناسقة',
      'اقترح مقياس خطوط وهوامش هندسية'
    ],
    auditor: [
      'افحص التباين اللوني وفق WCAG AAA',
      'تحقق من اتساع مساحات اللمس'
    ]
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl flex flex-col select-none transition-all duration-300">
      {/* Toast Notification of Applied Code/Design */}
      {lastAppliedNotification && (
        <div className="mb-2 self-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-medium text-xs shadow-xl shadow-emerald-500/20 border border-white/20 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-white" />
          <span>{lastAppliedNotification}</span>
        </div>
      )}

      {/* Expandable History Drawer (Only visible when user toggles history) */}
      {isAIBottomBarExpanded && (
        <div className="mb-2 bg-studio-panel/95 backdrop-blur-xl border border-studio-border rounded-2xl shadow-2xl p-4 flex flex-col max-h-80 overflow-hidden text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-studio-border">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-studio-accent" />
              <span className="font-bold text-white text-xs">سجل تفاعل وكلاء ديب سيك</span>
              <span className="text-[10px] text-studio-muted font-mono">({chatMessages.length} رسائل)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="text-studio-muted hover:text-white p-1 rounded hover:bg-studio-hover"
                title="مسح السجل"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsAIBottomBarExpanded(false)}
                className="text-studio-muted hover:text-white p-1 rounded hover:bg-studio-hover"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {chatMessages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-studio-muted mb-0.5 px-1">
                    {isUser ? 'أنت' : msg.sender === 'system' ? 'النظام' : activeAgent.nameAr}
                  </span>
                  <div className={`p-2.5 rounded-xl max-w-[90%] whitespace-pre-wrap leading-relaxed ${
                    isUser
                      ? 'bg-studio-accent text-white rounded-br-none shadow-sm'
                      : 'bg-studio-subpanel border border-studio-border text-studio-text rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}

                    {/* Action payload application button if user wants to re-apply */}
                    {msg.actionPayload?.nodes && (
                      <button
                        onClick={() => msg.actionPayload?.nodes && applyAgentNodes(msg.actionPayload.nodes)}
                        className="mt-2 w-full py-1.5 px-3 rounded-lg bg-studio-accent text-white font-medium text-[11px] flex items-center justify-center gap-1.5 hover:bg-studio-accentHover"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>إعادة تطبيق العناصر على مساحة العمل</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Main Bottom AI Dock Bar */}
      <div className="bg-studio-panel/95 backdrop-blur-xl border border-studio-border rounded-2xl shadow-2xl p-2 flex items-center gap-2 relative">
        {/* Agent Dropdown Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-studio-subpanel hover:bg-studio-hover border border-studio-border text-white text-xs font-medium transition active:scale-95"
            title="انقر لاختيار وكيل الذكاء الاصطناعي"
          >
            <span className="text-base">{activeAgent.avatar}</span>
            <span className="max-w-[120px] truncate">{activeAgent.nameAr}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-studio-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full mb-2 right-0 w-64 bg-studio-panel border border-studio-border rounded-2xl shadow-2xl p-1.5 space-y-1 z-50">
              <span className="text-[10px] text-studio-muted block px-2.5 py-1 font-semibold uppercase">
                اختر وكيل ديب سيك:
              </span>
              {AI_AGENTS.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => {
                    setActiveAgentRole(agent.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-right transition text-xs ${
                    activeAgent.id === agent.id
                      ? 'bg-studio-accent/20 border border-studio-accent/40 text-white font-bold'
                      : 'hover:bg-studio-subpanel text-studio-text'
                  }`}
                >
                  <span className="text-lg">{agent.avatar}</span>
                  <div className="min-w-0">
                    <span className="block leading-tight">{agent.nameAr}</span>
                    <span className="text-[10px] text-studio-muted block truncate mt-0.5">{agent.descriptionAr}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Field Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center relative">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isAgentGenerating}
            placeholder={
              activeAgent.id === 'code'
                ? 'اطلب كوداً ليطبق فوراً (مثال: اكتب كود بطاقة تسعير بـ Tailwind)...'
                : `اطلب من ${activeAgent.nameAr} تصميم ما تريد...`
            }
            className="w-full bg-studio-bg border border-studio-border focus:border-studio-accent rounded-xl pl-24 pr-4 py-2.5 text-xs text-white placeholder-studio-muted outline-none transition"
          />

          {/* Inside Input Action buttons */}
          <div className="absolute left-2 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isAgentGenerating}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-studio-accent to-purple-600 hover:from-studio-accentHover hover:to-purple-700 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-studio-accent/30 transition active:scale-95"
            >
              {isAgentGenerating ? (
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 rotate-180" />
              )}
              <span className="hidden sm:inline">{isAgentGenerating ? 'جاري التطبيق...' : 'تطبيق'}</span>
            </button>
          </div>
        </form>

        {/* Auto-Apply Toggle Pill */}
        <button
          type="button"
          onClick={() => setAutoApplyAI(!autoApplyAI)}
          title="عند التفعيل، يتم رسم الكود والتصميم مباشرة على مساحة العمل"
          className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-[11px] font-medium transition ${
            autoApplyAI
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-studio-subpanel text-studio-muted border-studio-border'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${autoApplyAI ? 'fill-current text-emerald-400' : ''}`} />
          <span className="hidden md:inline">تطبيق فوري</span>
        </button>

        {/* Quick Drawer Expand Toggle */}
        <button
          type="button"
          onClick={() => setIsAIBottomBarExpanded(!isAIBottomBarExpanded)}
          className={`p-2 rounded-xl border transition ${
            isAIBottomBarExpanded
              ? 'bg-studio-accent text-white border-studio-accent'
              : 'bg-studio-subpanel hover:bg-studio-hover text-studio-muted hover:text-white border-studio-border'
          }`}
          title="سجل المحادثة والأكواد"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Settings Opener */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-studio-subpanel hover:bg-studio-hover text-studio-muted hover:text-white border border-studio-border transition"
          title="إعدادات مفتاح DeepSeek"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts Bar below or above */}
      <div className="flex items-center gap-1.5 mt-1 px-3 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[10px] text-studio-muted flex-shrink-0 font-medium">مقترحات سريعة:</span>
        {quickPromptsByRole[activeAgent.id].map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendAgentPrompt(prompt)}
            disabled={isAgentGenerating}
            className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-studio-panel/90 hover:bg-studio-subpanel border border-studio-border/70 text-studio-muted hover:text-white transition flex-shrink-0 shadow-sm"
          >
            ⚡ {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

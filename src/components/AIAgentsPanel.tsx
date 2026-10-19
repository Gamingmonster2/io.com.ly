import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Settings, 
  PlusCircle, 
  Check, 
  ArrowRight, 
  Code2, 
  Layers, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useStudio, AI_AGENTS } from '../context/StudioContext';
import { AIAgentRole } from '../types';

interface AIAgentsPanelProps {
  onOpenSettings: () => void;
}

export const AIAgentsPanel: React.FC<AIAgentsPanelProps> = ({ onOpenSettings }) => {
  const { 
    activeAgent, 
    setActiveAgentRole, 
    chatMessages, 
    sendAgentPrompt, 
    isAgentGenerating, 
    applyAgentNodes, 
    clearChat,
    deepSeekConfig 
  } = useStudio();

  const [inputPrompt, setInputPrompt] = useState('');
  const [appliedMessageIds, setAppliedMessageIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLiveKey = !!deepSeekConfig.apiKey && deepSeekConfig.apiKey.trim().length > 0;

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAgentGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isAgentGenerating) return;
    const p = inputPrompt;
    setInputPrompt('');
    sendAgentPrompt(p);
  };

  const handleApplyNodes = (msgId: string, nodes: any[]) => {
    applyAgentNodes(nodes);
    setAppliedMessageIds(prev => [...prev, msgId]);
  };

  const quickPrompts: Record<AIAgentRole, string[]> = {
    architect: [
      'صمم واجهة تسجيل دخول عصرية داكنة',
      'أنشئ بطاقة مؤشرات أداء KPI للإيرادات',
      'صمم بطاقة ميزة تفاعلية مع زر تحريك',
      'أنشئ شريط تنقل علوي (Navbar) حديث'
    ],
    tokens: [
      'ولد لوحة ألوان دلالية احترافية بأسلوب نيون داكن',
      'اقترح مقياس خطوط طباعية متناسق',
      'صمم تدرجات ألوان للأزرار التفاعلية'
    ],
    code: [
      'ولد كود React و Tailwind للعنصر المحدد',
      'اكتب كود SwiftUI لنفس التخطيط',
      'اشرح كيفية عمل انتقال Auto-Animate برمجياً'
    ],
    auditor: [
      'افحص تباين الألوان في مساحة العمل (WCAG)',
      'هل مساحات اللمس للأزرار كافية على الهواتف؟',
      'قدم 3 نصائح لتحسين التجربة البصرية'
    ]
  };

  return (
    <div className="w-84 bg-studio-panel border-r border-studio-border flex flex-col h-full select-none z-10 text-xs">
      {/* Top Panel Header */}
      <div className="p-3 border-b border-studio-border flex items-center justify-between bg-studio-subpanel/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-studio-accent to-purple-600 flex items-center justify-center text-white text-xs shadow-md shadow-studio-accent/30">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs">وكلاء ديب سيك (DeepSeek AI)</span>
              <span className={`w-2 h-2 rounded-full ${isLiveKey ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
            </div>
            <span className="text-[10px] text-studio-muted font-mono">{deepSeekConfig.model}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            title="مسح المحادثة"
            className="p-1.5 rounded-lg text-studio-muted hover:text-white hover:bg-studio-hover transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenSettings}
            title="إعدادات مفتاح DeepSeek"
            className="p-1.5 rounded-lg text-studio-muted hover:text-white hover:bg-studio-hover transition"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Agent Selector Tabs */}
      <div className="p-2 border-b border-studio-border bg-studio-bg/60">
        <span className="text-[10px] text-studio-muted font-medium block mb-1.5 px-1">اختر الوكيل المتخصص:</span>
        <div className="grid grid-cols-2 gap-1.5">
          {AI_AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => setActiveAgentRole(agent.id)}
              className={`p-2 rounded-lg text-right transition flex items-center gap-2 ${
                activeAgent.id === agent.id
                  ? 'bg-studio-subpanel border border-studio-accent/50 text-white shadow-sm'
                  : 'hover:bg-studio-subpanel/50 text-studio-muted hover:text-studio-text border border-transparent'
              }`}
            >
              <span className="text-base">{agent.avatar}</span>
              <div className="min-w-0">
                <span className="font-semibold block text-[11px] truncate leading-tight">{agent.nameAr}</span>
                <span className="text-[9px] text-studio-muted truncate block">{agent.name.split(' ')[1]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chatMessages.map(msg => {
          const isUser = msg.sender === 'user';
          const isSys = msg.sender === 'system';
          const isApplied = appliedMessageIds.includes(msg.id);

          return (
            <div
              key={msg.id}
              className={`flex flex-col space-y-1.5 ${
                isUser ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-studio-muted px-1">
                {isUser ? (
                  <>
                    <span>أنت</span>
                    <User className="w-3 h-3" />
                  </>
                ) : isSys ? (
                  <>
                    <HelpCircle className="w-3 h-3 text-cyan-400" />
                    <span className="text-cyan-400">نظام InVision Studio</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-studio-accent" />
                    <span className="text-studio-accent font-medium">{activeAgent.nameAr}</span>
                  </>
                )}
              </div>

              <div
                className={`p-3 rounded-xl max-w-[95%] leading-relaxed ${
                  isUser
                    ? 'bg-studio-accent text-white rounded-br-none shadow-md shadow-studio-accent/20'
                    : isSys
                    ? 'bg-studio-bg border border-cyan-500/30 text-cyan-200 rounded-bl-none'
                    : 'bg-studio-subpanel border border-studio-border text-studio-text rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap text-xs font-normal">
                  {msg.text}
                </div>

                {/* If the message returned ADD_NODES action payload */}
                {msg.actionPayload?.type === 'ADD_NODES' && msg.actionPayload.nodes && (
                  <div className="mt-3 pt-2.5 border-t border-studio-border/60">
                    <button
                      onClick={() => msg.actionPayload?.nodes && handleApplyNodes(msg.id, msg.actionPayload.nodes)}
                      disabled={isApplied}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition active:scale-95 ${
                        isApplied
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-gradient-to-r from-studio-accent to-purple-600 text-white shadow-md shadow-studio-accent/30 hover:opacity-95'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>تم تطبيق العناصر على مساحة العمل ✓</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4" />
                          <span>✨ تطبيق التصميم على مساحة العمل الآن ({msg.actionPayload.nodes.length} كائنات)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isAgentGenerating && (
          <div className="flex items-center gap-2 p-3 bg-studio-subpanel/50 rounded-xl border border-studio-border text-xs text-studio-accent animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin text-studio-accent" />
            <span>وكيل ديب سيك يقوم بالتحليل وتجهيز التصميم الآن...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2 border-t border-studio-border bg-studio-bg/40">
        <span className="text-[10px] text-studio-muted block mb-1 px-1">مقترحات سريعة للوكيل الحالي:</span>
        <div className="flex flex-wrap gap-1">
          {quickPrompts[activeAgent.id].slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendAgentPrompt(prompt)}
              disabled={isAgentGenerating}
              className="text-[10px] px-2 py-1 rounded-md bg-studio-subpanel hover:bg-studio-hover border border-studio-border text-studio-muted hover:text-white transition truncate max-w-full"
            >
              ⚡ {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Prompt Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-studio-border bg-studio-subpanel/70">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isAgentGenerating}
            placeholder={`اطلب من ${activeAgent.nameAr}...`}
            className="w-full bg-studio-bg border border-studio-border focus:border-studio-accent rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-studio-muted outline-none transition"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isAgentGenerating}
            className="absolute left-2 p-1.5 rounded-lg bg-studio-accent hover:bg-studio-accentHover disabled:opacity-40 disabled:hover:bg-studio-accent text-white transition active:scale-95"
            title="إرسال الطلب"
          >
            <Send className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </form>
    </div>
  );
};

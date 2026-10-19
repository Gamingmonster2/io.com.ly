import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Cpu, 
  Globe, 
  Sliders, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

interface DeepSeekSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeepSeekSettingsModal: React.FC<DeepSeekSettingsModalProps> = ({ isOpen, onClose }) => {
  const { deepSeekConfig, updateDeepSeekConfig } = useStudio();
  
  const [apiKey, setApiKey] = useState(deepSeekConfig.apiKey);
  const [model, setModel] = useState(deepSeekConfig.model);
  const [baseUrl, setBaseUrl] = useState(deepSeekConfig.baseUrl);
  const [temperature, setTemperature] = useState(deepSeekConfig.temperature);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeepSeekConfig({
      apiKey: apiKey.trim(),
      model,
      baseUrl: baseUrl.trim(),
      temperature
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-studio-panel border border-studio-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-xs">
        {/* Header */}
        <div className="p-4 border-b border-studio-border flex items-center justify-between bg-studio-subpanel/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-studio-accent to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">إعدادات محرك DeepSeek AI</h3>
              <p className="text-[11px] text-studio-muted">ربط مفتاح API واختيار نموذج الذكاء الاصطناعي</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-studio-hover text-studio-muted hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Notice Banner */}
          <div className="p-3 rounded-xl bg-studio-bg border border-cyan-500/30 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-studio-muted leading-relaxed">
              يتم حفظ المفتاح محلياً في متصفحك (<code className="text-cyan-300 font-mono">localStorage</code>) بأمان تام. وفي حال عدم إدخال مفتاح، يعمل البرنامج تلقائياً بـ <strong className="text-white">المحاكي الذكي المدمج</strong> دون أي انقطاع!
            </p>
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-medium text-studio-text flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-studio-accent" />
                <span>مفتاح DeepSeek API Key</span>
              </label>
              <a
                href="https://platform.deepseek.com/api_keys"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-studio-accent hover:underline flex items-center gap-1"
              >
                <span>الحصول على مفتاح</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-studio-bg border border-studio-border focus:border-studio-accent rounded-xl px-3 py-2 text-white font-mono text-xs outline-none transition"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="font-medium text-studio-text flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>النموذج المعتمد (Model)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'deepseek-chat', label: 'DeepSeek Chat (V3)', desc: 'توليد واجهات شامل وسريع' },
                { id: 'deepseek-coder', label: 'DeepSeek Coder', desc: 'متخصص في كود React/Tailwind' },
                { id: 'deepseek-reasoner', label: 'DeepSeek R1', desc: 'تفكير استدلالي معماري عميق' },
              ].map(m => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setModel(m.id as any)}
                  className={`p-2 rounded-xl text-right border transition ${
                    model === m.id
                      ? 'bg-studio-accent/20 border-studio-accent text-white shadow-sm'
                      : 'bg-studio-bg border-studio-border text-studio-muted hover:text-white'
                  }`}
                >
                  <span className="font-semibold block text-[11px] font-mono">{m.label.split(' ')[0]}</span>
                  <span className="text-[10px] text-studio-muted leading-tight block mt-0.5">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Base URL */}
          <div className="space-y-1.5">
            <label className="font-medium text-studio-text flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>عنوان الخادم (Base URL)</span>
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full bg-studio-bg border border-studio-border focus:border-studio-accent rounded-xl px-3 py-2 text-white font-mono text-xs outline-none transition"
            />
          </div>

          {/* Temperature */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-medium text-studio-text flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>درجة الإبداعية (Temperature)</span>
              </label>
              <span className="font-mono text-white text-[11px]">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-studio-accent cursor-pointer"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-studio-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl hover:bg-studio-hover text-studio-muted hover:text-white transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-studio-accent hover:bg-studio-accentHover text-white font-semibold flex items-center gap-1.5 shadow-md shadow-studio-accent/25 transition active:scale-95"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : null}
              <span>{isSaved ? 'تم الحفظ بنجاح!' : 'حفظ الإعدادات'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

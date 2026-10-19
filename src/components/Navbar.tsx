import React from 'react';
import { 
  Play, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Bot, 
  Settings, 
  Sparkles, 
  Download,
  Layers,
  Code2,
  Palette
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

interface NavbarProps {
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings }) => {
  const { 
    zoom, 
    setZoom, 
    resetView, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    setPreviewAnimation,
    deepSeekConfig,
    activeTab,
    setActiveTab,
    nodes
  } = useStudio();

  const isLiveKey = !!deepSeekConfig.apiKey && deepSeekConfig.apiKey.trim().length > 0;

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(nodes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "invision_studio_scene.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <header className="h-14 bg-studio-panel border-b border-studio-border px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-studio-accent to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20 font-bold text-white text-lg">
            IN
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-sm">InVision Studio</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-studio-accent/20 text-studio-accent border border-studio-accent/30">
                AI Next-Gen
              </span>
            </div>
            <span className="text-[11px] text-studio-muted">مساحة عمل متجهة فائقة السرعة</span>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-studio-border mx-2" />

        {/* Navigation Tabs */}
        <div className="flex items-center bg-studio-bg/60 p-1 rounded-lg border border-studio-border">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-studio-accent/20 to-purple-500/20 text-studio-accent border border-studio-accent/40 shadow-sm'
                : 'text-studio-muted hover:text-studio-text hover:bg-studio-hover'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-studio-accent" />
            <span>وكلاء ديب سيك</span>
          </button>

          <button
            onClick={() => setActiveTab('layers')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === 'layers'
                ? 'bg-studio-panel text-white border border-studio-border shadow-sm'
                : 'text-studio-muted hover:text-studio-text hover:bg-studio-hover'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>الطبقات (Scene Graph)</span>
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === 'tokens'
                ? 'bg-studio-panel text-white border border-studio-border shadow-sm'
                : 'text-studio-muted hover:text-studio-text hover:bg-studio-hover'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>نظم التصميم</span>
          </button>

          <button
            onClick={() => setActiveTab('inspect')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === 'inspect'
                ? 'bg-studio-panel text-white border border-studio-border shadow-sm'
                : 'text-studio-muted hover:text-studio-text hover:bg-studio-hover'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>تفتيش الأكواد (Handoff)</span>
          </button>
        </div>
      </div>

      {/* Center Tools: Undo, Redo, Zoom */}
      <div className="flex items-center gap-1 bg-studio-subpanel/50 px-2 py-1 rounded-lg border border-studio-border/50">
        <button
          onClick={undo}
          disabled={!canUndo}
          title="تراجع (Ctrl+Z)"
          className={`p-1.5 rounded transition ${
            canUndo ? 'text-studio-text hover:bg-studio-hover active:scale-95' : 'text-studio-muted/40 cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="إعادة (Ctrl+Y)"
          className={`p-1.5 rounded transition ${
            canRedo ? 'text-studio-text hover:bg-studio-hover active:scale-95' : 'text-studio-muted/40 cursor-not-allowed'
          }`}
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-studio-border mx-1" />

        <button
          onClick={() => setZoom(z => Math.max(0.2, Math.round((z - 0.1) * 10) / 10))}
          title="تصغير (-)"
          className="p-1.5 text-studio-muted hover:text-white hover:bg-studio-hover rounded"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono font-medium text-studio-text w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(3, Math.round((z + 0.1) * 10) / 10))}
          title="تكبير (+)"
          className="p-1.5 text-studio-muted hover:text-white hover:bg-studio-hover rounded"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          title="إعادة ضبط العرض (100%)"
          className="p-1.5 text-studio-muted hover:text-white hover:bg-studio-hover rounded"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Controls: Play Auto-Animate & DeepSeek Agent Status */}
      <div className="flex items-center gap-2.5">
        {/* Auto-Animate Prototype Button */}
        <button
          onClick={() => setPreviewAnimation(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-studio-accent hover:bg-studio-accentHover text-white text-xs font-medium shadow-md shadow-studio-accent/25 transition active:scale-95"
          title="تشغيل محاكاة التحريك التلقائي بين الشاشات"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>تشغيل Auto-Animate</span>
        </button>

        {/* DeepSeek Status Pill */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-studio-subpanel hover:bg-studio-hover border border-studio-border text-xs transition"
          title="إعدادات مفتاح ومحرك DeepSeek"
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isLiveKey ? 'bg-emerald-400' : 'bg-cyan-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isLiveKey ? 'bg-emerald-500' : 'bg-cyan-500'
            }`} />
          </span>
          <span className="font-mono text-[11px] text-studio-text">
            {deepSeekConfig.model}
          </span>
          <Settings className="w-3.5 h-3.5 text-studio-muted" />
        </button>

        {/* Export JSON */}
        <button
          onClick={handleExportJson}
          className="p-1.5 rounded-lg bg-studio-subpanel hover:bg-studio-hover border border-studio-border text-studio-muted hover:text-white transition"
          title="تصدير شجرة المشهد JSON"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

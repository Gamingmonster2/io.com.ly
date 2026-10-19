import React from 'react';
import { 
  Play, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Settings, 
  Download,
  Layers,
  Code2,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Sparkles
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
    isLeftSidebarOpen,
    setIsLeftSidebarOpen,
    isInspectorOpen,
    setIsInspectorOpen,
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
    <header className="h-13 bg-studio-panel border-b border-studio-border px-3 py-2 flex items-center justify-between z-30 select-none">
      {/* Brand & Left Sidebar Toggles */}
      <div className="flex items-center gap-2.5">
        {/* Toggle Left Sidebar */}
        <button
          onClick={() => setIsLeftSidebarOpen(prev => !prev)}
          className={`p-1.5 rounded-lg border transition ${
            isLeftSidebarOpen
              ? 'bg-studio-accent/20 text-studio-accent border-studio-accent/40'
              : 'bg-studio-subpanel hover:bg-studio-hover text-studio-muted border-studio-border'
          }`}
          title={isLeftSidebarOpen ? 'إغلاق اللوحة الجانبية' : 'فتح اللوحة الجانبية (الطبقات والرموز)'}
        >
          {isLeftSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-studio-accent to-pink-500 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-pink-500/20">
            IN
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white text-xs">InVision Studio</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              DeepSeek AI
            </span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-studio-border mx-1" />

        {/* Tabs for Left Sidebar (When open) */}
        {isLeftSidebarOpen && (
          <div className="flex items-center bg-studio-bg/60 p-0.5 rounded-lg border border-studio-border">
            <button
              onClick={() => setActiveTab('layers')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                activeTab === 'layers'
                  ? 'bg-studio-panel text-white shadow-sm'
                  : 'text-studio-muted hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>الطبقات</span>
            </button>
            <button
              onClick={() => setActiveTab('tokens')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                activeTab === 'tokens'
                  ? 'bg-studio-panel text-white shadow-sm'
                  : 'text-studio-muted hover:text-white'
              }`}
            >
              <Palette className="w-3 h-3" />
              <span>الرموز</span>
            </button>
            <button
              onClick={() => setActiveTab('inspect')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                activeTab === 'inspect'
                  ? 'bg-studio-panel text-white shadow-sm'
                  : 'text-studio-muted hover:text-white'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>التفتيش</span>
            </button>
          </div>
        )}
      </div>

      {/* Center Tools: Undo, Redo, Zoom */}
      <div className="flex items-center gap-1 bg-studio-subpanel/50 px-2 py-0.5 rounded-lg border border-studio-border/50 text-xs">
        <button
          onClick={undo}
          disabled={!canUndo}
          title="تراجع (Ctrl+Z)"
          className={`p-1.5 rounded transition ${
            canUndo ? 'text-studio-text hover:bg-studio-hover active:scale-95' : 'text-studio-muted/30 cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="إعادة (Ctrl+Y)"
          className={`p-1.5 rounded transition ${
            canRedo ? 'text-studio-text hover:bg-studio-hover active:scale-95' : 'text-studio-muted/30 cursor-not-allowed'
          }`}
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <div className="h-3 w-[1px] bg-studio-border mx-1" />

        <button
          onClick={() => setZoom(z => Math.max(0.2, Math.round((z - 0.1) * 10) / 10))}
          title="تصغير (-)"
          className="p-1 text-studio-muted hover:text-white rounded"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-mono text-studio-text w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(3, Math.round((z + 0.1) * 10) / 10))}
          title="تكبير (+)"
          className="p-1 text-studio-muted hover:text-white rounded"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={resetView}
          title="إعادة ضبط العرض (100%)"
          className="p-1 text-studio-muted hover:text-white rounded"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Right Controls: Play, DeepSeek Badge, Inspector Toggle */}
      <div className="flex items-center gap-2">
        {/* Auto-Animate Prototype Button */}
        <button
          onClick={() => setPreviewAnimation(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-studio-accent hover:bg-studio-accentHover text-white text-xs font-medium shadow-md shadow-studio-accent/25 transition active:scale-95"
          title="تشغيل التحريك التلقائي بين الشاشات"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Auto-Animate</span>
        </button>

        {/* DeepSeek Status */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-studio-subpanel hover:bg-studio-hover border border-studio-border text-xs transition"
          title="إعدادات DeepSeek API"
        >
          <span className={`w-2 h-2 rounded-full ${isLiveKey ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
          <span className="font-mono text-[10px] text-studio-text">{deepSeekConfig.model}</span>
          <Settings className="w-3 h-3 text-studio-muted" />
        </button>

        {/* Export JSON */}
        <button
          onClick={handleExportJson}
          className="p-1.5 rounded-lg bg-studio-subpanel hover:bg-studio-hover border border-studio-border text-studio-muted hover:text-white transition"
          title="تصدير شجرة المشهد JSON"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-studio-border mx-1" />

        {/* Toggle Right Inspector */}
        <button
          onClick={() => setIsInspectorOpen(prev => !prev)}
          className={`p-1.5 rounded-lg border transition ${
            isInspectorOpen
              ? 'bg-studio-accent/20 text-studio-accent border-studio-accent/40'
              : 'bg-studio-subpanel hover:bg-studio-hover text-studio-muted border-studio-border'
          }`}
          title={isInspectorOpen ? 'طي لوحة الخصائص' : 'إظهار لوحة الخصائص'}
        >
          {isInspectorOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};

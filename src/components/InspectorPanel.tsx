import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Component as ComponentIcon, 
  Move, 
  Maximize2, 
  Type as TypeIcon, 
  Paintbrush, 
  ChevronLeft,
  ChevronRight,
  Code2,
  Sparkle
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const InspectorPanel: React.FC = () => {
  const { 
    nodes, 
    selectedIds, 
    updateNode, 
    isInspectorOpen, 
    setIsInspectorOpen,
    sendAgentPrompt
  } = useStudio();

  if (!isInspectorOpen) return null;

  const selectedNode = nodes.find(n => selectedIds.includes(n.id));

  if (!selectedNode) {
    return (
      <div className="w-72 bg-studio-panel border-l border-studio-border flex flex-col h-full select-none z-20">
        <div className="p-3 border-b border-studio-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-studio-accent" />
            <span className="font-semibold uppercase tracking-wide text-white text-xs">خصائص العنصر</span>
          </div>
          <button
            onClick={() => setIsInspectorOpen(false)}
            className="p-1 rounded hover:bg-studio-hover text-studio-muted hover:text-white transition"
            title="طي لوحة الخصائص"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-studio-muted">
          <Sliders className="w-8 h-8 mb-3 opacity-30 text-studio-accent" />
          <p className="text-xs font-medium text-studio-text mb-1">لا يوجد عنصر محدد</p>
          <p className="text-[11px] leading-relaxed">
            انقر فوق أي عنصر في مساحة العمل لتعديل أبعاده وخصائصه وكوده البرمجي.
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (field: string, val: any) => {
    updateNode(selectedNode.id, { [field]: val });
  };

  const isLiveCode = selectedNode.type === 'live_code';

  return (
    <div className="w-72 bg-studio-panel border-l border-studio-border flex flex-col h-full overflow-y-auto select-none z-20 text-xs">
      {/* Header with collapse button */}
      <div className="p-3 border-b border-studio-border flex items-center justify-between sticky top-0 bg-studio-panel z-10">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-studio-accent" />
          <span className="font-semibold uppercase tracking-wide text-white text-xs">خصائص العنصر</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-studio-subpanel border border-studio-border font-mono text-cyan-400">
            {selectedNode.type}
          </span>
          <button
            onClick={() => setIsInspectorOpen(false)}
            className="p-1 rounded hover:bg-studio-hover text-studio-muted hover:text-white transition"
            title="طي لوحة الخصائص لتوسيع مساحة العمل"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3 space-y-4">
        {/* If Live Code Node: Show Live Code Editor right away! */}
        {isLiveCode && (
          <div className="p-3 rounded-xl bg-studio-subpanel border border-cyan-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-xs">
                <Code2 className="w-4 h-4" />
                <span>محرر الكود الحي (HTML & Tailwind)</span>
              </div>
              <span className="text-[9px] px-1 bg-cyan-500/20 text-cyan-300 rounded font-mono">تطبيق فوري</span>
            </div>
            <p className="text-[10px] text-studio-muted">
              أي تعديل على الكود يطبق فوراً وبشكل مرئي على مساحة العمل:
            </p>
            <textarea
              value={selectedNode.codeSnippet || ''}
              onChange={(e) => handleChange('codeSnippet', e.target.value)}
              rows={8}
              className="w-full bg-studio-bg border border-studio-border focus:border-cyan-400 rounded-lg p-2 font-mono text-[10px] text-cyan-200 outline-none leading-relaxed"
            />
            <button
              onClick={() => sendAgentPrompt(`قم بتعديل وتحسين كود المكون: ${selectedNode.name} ليكون أكثر عصرية مع إضافة تأثيرات حركية.`)}
              className="w-full py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-medium text-[11px] flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>طلب تحسين الكود من ديب سيك</span>
            </button>
          </div>
        )}

        {/* Geometry (X, Y, W, H) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-[11px] font-medium text-studio-muted">
            <Move className="w-3.5 h-3.5 text-studio-accent" />
            <span>الموضع والأبعاد (Geometry)</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1">
              <span className="text-studio-muted text-[10px] font-mono mr-1">X</span>
              <input
                type="number"
                value={Math.round(selectedNode.x)}
                onChange={(e) => handleChange('x', Number(e.target.value))}
                className="bg-transparent w-full text-right outline-none text-white font-mono text-xs"
              />
            </div>
            <div className="flex items-center bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1">
              <span className="text-studio-muted text-[10px] font-mono mr-1">Y</span>
              <input
                type="number"
                value={Math.round(selectedNode.y)}
                onChange={(e) => handleChange('y', Number(e.target.value))}
                className="bg-transparent w-full text-right outline-none text-white font-mono text-xs"
              />
            </div>
            <div className="flex items-center bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1">
              <span className="text-studio-muted text-[10px] font-mono mr-1">W</span>
              <input
                type="number"
                value={Math.round(selectedNode.width)}
                onChange={(e) => handleChange('width', Number(e.target.value))}
                className="bg-transparent w-full text-right outline-none text-white font-mono text-xs"
              />
            </div>
            <div className="flex items-center bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1">
              <span className="text-studio-muted text-[10px] font-mono mr-1">H</span>
              <input
                type="number"
                value={Math.round(selectedNode.height)}
                onChange={(e) => handleChange('height', Number(e.target.value))}
                className="bg-transparent w-full text-right outline-none text-white font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Appearance (Fill & Stroke & Radius) */}
        {!isLiveCode && (
          <div className="space-y-3">
            <div className="flex items-center gap-1 text-[11px] font-medium text-studio-muted">
              <Paintbrush className="w-3.5 h-3.5 text-emerald-400" />
              <span>المظهر والألوان</span>
            </div>

            {/* Fill */}
            <div className="space-y-1">
              <span className="text-[10px] text-studio-muted">لون التعبئة (Fill)</span>
              <div className="flex items-center gap-2 bg-studio-subpanel border border-studio-border rounded-lg p-1.5">
                <input
                  type="color"
                  value={selectedNode.fill?.startsWith('#') ? selectedNode.fill : '#1E1E24'}
                  onChange={(e) => handleChange('fill', e.target.value)}
                  className="w-6 h-6 rounded border border-studio-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={selectedNode.fill || ''}
                  onChange={(e) => handleChange('fill', e.target.value)}
                  className="bg-transparent flex-1 text-xs text-white font-mono outline-none"
                />
              </div>
            </div>

            {/* Radius & Opacity */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1">
                <span className="text-studio-muted text-[10px] mr-1">الحواف</span>
                <input
                  type="number"
                  value={selectedNode.borderRadius || 0}
                  onChange={(e) => handleChange('borderRadius', Number(e.target.value))}
                  className="bg-transparent w-full text-right outline-none text-white font-mono text-xs"
                />
              </div>
              <div className="flex items-center bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1">
                <span className="text-studio-muted text-[10px] mr-1">الشفافية</span>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={selectedNode.opacity ?? 1}
                  onChange={(e) => handleChange('opacity', Number(e.target.value))}
                  className="bg-transparent w-full text-right outline-none text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Text/Typography for text & button */}
        {(selectedNode.type === 'text' || selectedNode.type === 'button') && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-[11px] font-medium text-studio-muted">
              <TypeIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>محتوى النص</span>
            </div>
            <input
              type="text"
              value={selectedNode.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              className="w-full bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1.5 text-xs text-white outline-none"
            />
          </div>
        )}

        {/* Auto-Animate Transition Key */}
        <div className="pt-2 border-t border-studio-border space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-cyan-400">
            <div className="flex items-center gap-1">
              <Sparkle className="w-3.5 h-3.5" />
              <span>معرف التحريك التلقائي</span>
            </div>
            <span className="text-[9px] text-studio-muted font-mono">Transition Key</span>
          </div>
          <input
            type="text"
            value={selectedNode.transitionKey || ''}
            onChange={(e) => handleChange('transitionKey', e.target.value)}
            placeholder="مثال: btn_submit"
            className="w-full bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1 text-xs text-white font-mono outline-none"
          />
        </div>
      </div>
    </div>
  );
};

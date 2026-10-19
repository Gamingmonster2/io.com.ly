import React from 'react';
import { 
  Sliders, 
  Sparkles, 
  Component as ComponentIcon, 
  Move, 
  Maximize2, 
  Type as TypeIcon, 
  Paintbrush, 
  Layers,
  Sparkle
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const InspectorPanel: React.FC = () => {
  const { nodes, selectedIds, updateNode, setActiveTab } = useStudio();

  const selectedNode = nodes.find(n => selectedIds.includes(n.id));

  if (!selectedNode) {
    return (
      <div className="w-72 bg-studio-panel border-l border-studio-border flex flex-col items-center justify-center p-6 text-center text-studio-muted select-none">
        <Sliders className="w-8 h-8 mb-3 opacity-30 text-studio-accent" />
        <p className="text-xs font-medium text-studio-text mb-1">لا يوجد عنصر محدد</p>
        <p className="text-[11px] leading-relaxed">
          انقر فوق أي كائن متجهات في مساحة العمل لتعديل أبعاده وخصائصه البصرية.
        </p>
      </div>
    );
  }

  const handleChange = (field: string, val: any) => {
    updateNode(selectedNode.id, { [field]: val });
  };

  return (
    <div className="w-72 bg-studio-panel border-l border-studio-border flex flex-col h-full overflow-y-auto select-none z-10 text-xs">
      {/* Header */}
      <div className="p-3 border-b border-studio-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-studio-accent" />
          <span className="font-semibold uppercase tracking-wide text-white">خصائص العنصر (Inspector)</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-studio-subpanel border border-studio-border font-mono text-studio-muted">
          {selectedNode.type}
        </span>
      </div>

      <div className="p-3 space-y-4">
        {/* Alignment quick buttons */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-studio-muted">المحاذاة السريعة</label>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => handleChange('x', 40)}
              className="py-1 px-1.5 bg-studio-subpanel hover:bg-studio-hover rounded text-center text-[10px] border border-studio-border"
              title="محاذاة لليسار"
            >
              يسار
            </button>
            <button
              onClick={() => handleChange('x', 200)}
              className="py-1 px-1.5 bg-studio-subpanel hover:bg-studio-hover rounded text-center text-[10px] border border-studio-border"
              title="توسيط أفقي"
            >
              وسط
            </button>
            <button
              onClick={() => handleChange('x', 400)}
              className="py-1 px-1.5 bg-studio-subpanel hover:bg-studio-hover rounded text-center text-[10px] border border-studio-border"
              title="محاذاة لليمين"
            >
              يمين
            </button>
            <button
              onClick={() => handleChange('y', 80)}
              className="py-1 px-1.5 bg-studio-subpanel hover:bg-studio-hover rounded text-center text-[10px] border border-studio-border"
              title="محاذاة للأعلى"
            >
              أعلى
            </button>
          </div>
        </div>

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

        {/* Radius & Opacity */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-[11px] font-medium text-studio-muted">
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            <span>الاستدارة والشفافية</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1">
              <span className="text-studio-muted text-[10px] mr-1">نصف القطر</span>
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

        {/* Appearance: Fill & Stroke */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-[11px] font-medium text-studio-muted">
            <Paintbrush className="w-3.5 h-3.5 text-emerald-400" />
            <span>المظهر والألوان (Appearance)</span>
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
                placeholder="#1E1E24"
              />
            </div>
          </div>

          {/* Stroke */}
          <div className="space-y-1">
            <span className="text-[10px] text-studio-muted">لون الإطار الخارجي (Stroke)</span>
            <div className="flex items-center gap-2 bg-studio-subpanel border border-studio-border rounded-lg p-1.5">
              <input
                type="color"
                value={selectedNode.stroke?.startsWith('#') ? selectedNode.stroke : '#33333E'}
                onChange={(e) => handleChange('stroke', e.target.value)}
                className="w-6 h-6 rounded border border-studio-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={selectedNode.stroke || ''}
                onChange={(e) => handleChange('stroke', e.target.value)}
                className="bg-transparent flex-1 text-xs text-white font-mono outline-none"
                placeholder="#33333E"
              />
              <input
                type="number"
                min="0"
                max="10"
                value={selectedNode.strokeWidth || 0}
                onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
                className="w-12 bg-studio-bg border border-studio-border rounded text-center text-xs text-white font-mono"
                title="سمك الإطار (px)"
              />
            </div>
          </div>
        </div>

        {/* Typography (for text or button) */}
        {(selectedNode.type === 'text' || selectedNode.type === 'button') && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-[11px] font-medium text-studio-muted">
              <TypeIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>الطباعة والنص (Typography)</span>
            </div>

            <div className="space-y-1.5">
              <input
                type="text"
                value={selectedNode.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-studio-accent"
                placeholder="محتوى النص..."
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1">
                  <span className="text-studio-muted text-[10px] mr-1">الحجم</span>
                  <input
                    type="number"
                    value={selectedNode.fontSize || 14}
                    onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                    className="bg-transparent w-full text-right outline-none text-white font-mono text-xs"
                  />
                </div>
                <div className="flex items-center bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1">
                  <span className="text-studio-muted text-[10px] mr-1">اللون</span>
                  <input
                    type="color"
                    value={selectedNode.textColor?.startsWith('#') ? selectedNode.textColor : '#FFFFFF'}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer bg-transparent mr-1"
                  />
                  <input
                    type="text"
                    value={selectedNode.textColor || '#FFFFFF'}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="bg-transparent w-full text-right outline-none text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Master Component & Auto-Animate Keyframe Link */}
        <div className="pt-2 border-t border-studio-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ComponentIcon className="w-3.5 h-3.5 text-studio-accent" />
              <span className="text-[11px] font-medium text-studio-text">مكون رئيسي (Master)</span>
            </div>
            <input
              type="checkbox"
              checked={!!selectedNode.isMasterComponent}
              onChange={(e) => handleChange('isMasterComponent', e.target.checked)}
              className="accent-studio-accent cursor-pointer"
            />
          </div>

          {/* Transition Key for Auto-Animate */}
          <div className="space-y-1">
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
              className="w-full bg-studio-subpanel border border-studio-border rounded-lg px-2 py-1 text-xs text-white font-mono outline-none focus:border-cyan-400"
            />
            <p className="text-[10px] text-studio-muted leading-tight">
              عند تطابق هذا المعرف بين شاشتين، يقوم محرك Auto-Animate بحساب الانسيابية التلقائية بينهما!
            </p>
          </div>
        </div>

        {/* DeepSeek Quick Assist Button for this selected node */}
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('ai')}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-studio-accent/20 to-purple-600/20 hover:from-studio-accent/30 hover:to-purple-600/30 border border-studio-accent/40 text-studio-accent hover:text-white flex items-center justify-center gap-2 transition font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>طلب تحليل DeepSeek لهذا العنصر</span>
          </button>
        </div>
      </div>
    </div>
  );
};

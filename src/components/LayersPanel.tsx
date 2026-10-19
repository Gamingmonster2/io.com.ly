import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Layout, 
  Square, 
  Circle, 
  Type, 
  Component, 
  CreditCard,
  Layers as LayersIcon
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { SceneNode, NodeType } from '../types';

export const LayersPanel: React.FC = () => {
  const { 
    nodes, 
    selectedIds, 
    selectNode, 
    updateNode, 
    deleteSelected, 
    reorderNode 
  } = useStudio();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'artboard': return <Layout className="w-3.5 h-3.5 text-purple-400" />;
      case 'rectangle': return <Square className="w-3.5 h-3.5 text-blue-400" />;
      case 'circle': return <Circle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'text': return <Type className="w-3.5 h-3.5 text-amber-400" />;
      case 'button': return <Component className="w-3.5 h-3.5 text-studio-accent" />;
      case 'card': return <CreditCard className="w-3.5 h-3.5 text-cyan-400" />;
      default: return <Square className="w-3.5 h-3.5 text-studio-muted" />;
    }
  };

  const startRename = (node: SceneNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(node.id);
    setEditingName(node.name);
  };

  const saveRename = (id: string) => {
    if (editingName.trim()) {
      updateNode(id, { name: editingName.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="w-72 bg-studio-panel border-r border-studio-border flex flex-col h-full select-none z-10">
      {/* Header */}
      <div className="p-3 border-b border-studio-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayersIcon className="w-4 h-4 text-studio-accent" />
          <span className="font-semibold text-xs tracking-wide uppercase text-white">شجرة المشهد (Scene Graph)</span>
        </div>
        <span className="text-[11px] font-mono text-studio-muted">{nodes.length} طبقات</span>
      </div>

      {/* Layer List (Rendered reverse so top visual layer is at top of list) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {nodes.slice().reverse().map((node) => {
          const isSelected = selectedIds.includes(node.id);
          const isEditing = editingId === node.id;

          return (
            <div
              key={node.id}
              onClick={(e) => {
                selectNode(node.id, e.shiftKey);
              }}
              className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-studio-accent/15 text-white border border-studio-accent/40 font-medium' 
                  : 'text-studio-muted hover:text-studio-text hover:bg-studio-subpanel'
              }`}
            >
              {/* Left info: Icon & Name */}
              <div className="flex items-center gap-2 flex-1 min-w-0 pr-1">
                {getNodeIcon(node.type)}
                {isEditing ? (
                  <input
                    type="text"
                    value={editingName}
                    autoFocus
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => saveRename(node.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveRename(node.id)}
                    className="bg-studio-subpanel border border-studio-accent rounded px-1.5 py-0.5 text-xs text-white outline-none w-32"
                  />
                ) : (
                  <span 
                    onDoubleClick={(e) => startRename(node, e)}
                    className="truncate select-none text-[12px]"
                    title="انقر نقراً مزدوجاً لإعادة التسمية"
                  >
                    {node.name}
                  </span>
                )}

                {/* Master Badge */}
                {node.isMasterComponent && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-studio-accent/20 text-studio-accent border border-studio-accent/30">
                    Master
                  </span>
                )}
                {node.transitionKey && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    Auto-Animate
                  </span>
                )}
              </div>

              {/* Quick Actions on Hover / Selection */}
              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
                {/* Reorder */}
                <button
                  onClick={(e) => { e.stopPropagation(); reorderNode(node.id, 'up'); }}
                  title="تقديم للأمام"
                  className="p-1 hover:text-white rounded"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); reorderNode(node.id, 'down'); }}
                  title="إرسال للخلف"
                  className="p-1 hover:text-white rounded"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Visibility */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateNode(node.id, { visible: node.visible === false ? true : false });
                  }}
                  title={node.visible === false ? 'إظهار الطبقة' : 'إخفاء الطبقة'}
                  className="p-1 hover:text-white rounded"
                >
                  {node.visible === false ? (
                    <EyeOff className="w-3.5 h-3.5 text-studio-muted" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Lock */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateNode(node.id, { locked: !node.locked });
                  }}
                  title={node.locked ? 'إلغاء القفل' : 'قفل الطبقة'}
                  className="p-1 hover:text-white rounded"
                >
                  {node.locked ? (
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5 text-studio-muted" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-studio-border bg-studio-subpanel/30 text-[11px] text-studio-muted flex items-center justify-between">
        <span>مصفوفة التحويل 3×3 متفاعلة</span>
        <button
          onClick={deleteSelected}
          disabled={selectedIds.length === 0}
          className="text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          <span>حذف المحدد</span>
        </button>
      </div>
    </div>
  );
};

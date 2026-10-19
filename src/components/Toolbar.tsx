import React from 'react';
import { 
  MousePointer, 
  Square, 
  Circle, 
  Type, 
  Hand, 
  Layout, 
  Component, 
  Trash2, 
  Copy,
  Sparkles
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { ToolType } from '../types';

export const Toolbar: React.FC = () => {
  const { 
    activeTool, 
    setActiveTool, 
    addNode, 
    selectedIds, 
    deleteSelected, 
    duplicateSelected,
    setIsAIBottomBarExpanded
  } = useStudio();

  const handleToolClick = (tool: ToolType) => {
    setActiveTool(tool);

    // If quick-insert tool, spawn on canvas directly
    if (tool === 'artboard') {
      addNode({
        name: 'شاشة جديدة (Artboard)',
        type: 'artboard',
        x: 400 + Math.random() * 80,
        y: 120 + Math.random() * 80,
        width: 375,
        height: 667,
        fill: '#181820',
        stroke: '#2E2E38',
        strokeWidth: 1,
        borderRadius: 20
      });
      setActiveTool('select');
    } else if (tool === 'rectangle') {
      addNode({
        name: 'مستطيل متجهات',
        type: 'rectangle',
        x: 350 + Math.random() * 50,
        y: 200 + Math.random() * 50,
        width: 160,
        height: 100,
        fill: '#24242E',
        stroke: '#3E3E4E',
        strokeWidth: 1,
        borderRadius: 12
      });
      setActiveTool('select');
    } else if (tool === 'circle') {
      addNode({
        name: 'دائرة متجهات',
        type: 'circle',
        x: 350 + Math.random() * 50,
        y: 200 + Math.random() * 50,
        width: 120,
        height: 120,
        fill: '#FF3366',
        borderRadius: 999
      });
      setActiveTool('select');
    } else if (tool === 'text') {
      addNode({
        name: 'طبقة نص جديدة',
        type: 'text',
        x: 350 + Math.random() * 50,
        y: 200 + Math.random() * 50,
        width: 220,
        height: 40,
        content: 'نص قابل للتعديل',
        fontSize: 18,
        fontWeight: '600',
        textColor: '#FFFFFF',
        textAlign: 'right'
      });
      setActiveTool('select');
    } else if (tool === 'button') {
      addNode({
        name: 'زر تفاعلي (Master)',
        type: 'button',
        x: 350 + Math.random() * 50,
        y: 200 + Math.random() * 50,
        width: 200,
        height: 48,
        fill: '#FF3366',
        borderRadius: 10,
        content: 'زر مخصص',
        fontSize: 15,
        fontWeight: '600',
        textColor: '#FFFFFF',
        textAlign: 'center',
        isMasterComponent: true
      });
      setActiveTool('select');
    }
  };

  return (
    <aside className="w-14 bg-studio-panel border-r border-studio-border flex flex-col items-center py-4 justify-between z-20 select-none">
      {/* Top Tools */}
      <div className="flex flex-col items-center gap-1.5 w-full px-2">
        <button
          onClick={() => handleToolClick('select')}
          title="أداة الاختيار والتحريك (V)"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'select'
              ? 'bg-studio-accent text-white shadow-lg shadow-studio-accent/30'
              : 'text-studio-muted hover:text-white hover:bg-studio-hover'
          }`}
        >
          <MousePointer className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleToolClick('artboard')}
          title="إضافة شاشة جديدة Artboard (A)"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'artboard'
              ? 'bg-studio-accent text-white shadow-lg shadow-studio-accent/30'
              : 'text-studio-muted hover:text-white hover:bg-studio-hover'
          }`}
        >
          <Layout className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleToolClick('rectangle')}
          title="مستطيل (R)"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'rectangle'
              ? 'bg-studio-accent text-white shadow-lg shadow-studio-accent/30'
              : 'text-studio-muted hover:text-white hover:bg-studio-hover'
          }`}
        >
          <Square className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleToolClick('circle')}
          title="دائرة (O)"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'circle'
              ? 'bg-studio-accent text-white shadow-lg shadow-studio-accent/30'
              : 'text-studio-muted hover:text-white hover:bg-studio-hover'
          }`}
        >
          <Circle className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleToolClick('text')}
          title="نص (T)"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'text'
              ? 'bg-studio-accent text-white shadow-lg shadow-studio-accent/30'
              : 'text-studio-muted hover:text-white hover:bg-studio-hover'
          }`}
        >
          <Type className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleToolClick('button')}
          title="مكون زر تفاعلي (C)"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'button'
              ? 'bg-studio-accent text-white shadow-lg shadow-studio-accent/30'
              : 'text-studio-muted hover:text-white hover:bg-studio-hover'
          }`}
        >
          <Component className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleToolClick('pan')}
          title="أداة سحب مساحة العمل (H)"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'pan'
              ? 'bg-studio-accent text-white shadow-lg shadow-studio-accent/30'
              : 'text-studio-muted hover:text-white hover:bg-studio-hover'
          }`}
        >
          <Hand className="w-4 h-4" />
        </button>

        <div className="w-8 h-[1px] bg-studio-border my-2" />

        {/* Selected actions */}
        {selectedIds.length > 0 && (
          <>
            <button
              onClick={duplicateSelected}
              title="تكرار العنصر (Ctrl+D)"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-studio-muted hover:text-white hover:bg-studio-hover transition"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={deleteSelected}
              title="حذف العنصر (Delete)"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Bottom AI Quick Action Pill */}
      <div className="w-full px-2">
        <button
          onClick={() => setIsAIBottomBarExpanded(prev => !prev)}
          title="فتح شريط وكيل DeepSeek"
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-studio-accent to-purple-600 text-white flex items-center justify-center shadow-lg shadow-studio-accent/40 hover:scale-105 active:scale-95 transition"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

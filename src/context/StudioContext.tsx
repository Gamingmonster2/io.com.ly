import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SceneNode, 
  ToolType, 
  DesignToken, 
  DeepSeekConfig, 
  AIAgentRole, 
  AIAgent, 
  AgentChatMessage 
} from '../types';
import { DEFAULT_DEEPSEEK_CONFIG, callDeepSeekAgent } from '../services/deepseek';

export const AI_AGENTS: AIAgent[] = [
  {
    id: 'architect',
    name: 'DeepSeek Canvas Architect',
    nameAr: 'معمار الواجهات (DeepSeek)',
    descriptionAr: 'توليد عناصر وشاشات متجهة كاملة مباشرة على مساحة العمل بأسلوب ذكي',
    avatar: '📐',
    color: '#FF3366'
  },
  {
    id: 'tokens',
    name: 'DeepSeek Design Tokens',
    nameAr: 'نظم التصميم والرموز',
    descriptionAr: 'توليد ومواءمة لوحات الألوان، وقياسات الطباعة والهوامش المتناسقة',
    avatar: '🎨',
    color: '#7928CA'
  },
  {
    id: 'code',
    name: 'DeepSeek Code Generator',
    nameAr: 'تسليم المطورين والأكواد',
    descriptionAr: 'تحويل أي عنصر أو شاشة إلى أكواد React و Tailwind و SwiftUI بنقرة زر',
    avatar: '💻',
    color: '#00D2FF'
  },
  {
    id: 'auditor',
    name: 'DeepSeek UX Auditor',
    nameAr: 'مدقق التباين والوصول',
    descriptionAr: 'فحص التباين البصري وتوافق معايير WCAG وتناسق عناصر التصميم',
    avatar: '🔍',
    color: '#10B981'
  }
];

const INITIAL_TOKENS: DesignToken[] = [
  { id: 'tok-1', name: 'اللون الرئيسي InVision', key: 'color.brand.primary', value: '#FF3366', category: 'color' },
  { id: 'tok-2', name: 'لون التركيز النيون', key: 'color.accent.cyan', value: '#00D2FF', category: 'color' },
  { id: 'tok-3', name: 'الخلفية الداكنة العميقة', key: 'color.bg.canvas', value: '#141417', category: 'color' },
  { id: 'tok-4', name: 'لون اللوحات الجانبية', key: 'color.bg.panel', value: '#1E1E24', category: 'color' },
  { id: 'tok-5', name: 'الخط الرئيسي للمشروع', key: 'font.family.primary', value: 'Cairo, Inter', category: 'typography' },
  { id: 'tok-6', name: 'الحشو الداخلي القياسي', key: 'spacing.base.padding', value: '16px', category: 'spacing' },
];

// Initial scene nodes demonstrating the exact InVision Studio Auto-Animate case from PDF Page 4!
const INITIAL_NODES: SceneNode[] = [
  // Artboard A: Initial State
  {
    id: 'artboard-a',
    name: 'الشاشة A (الحالة الابتدائية)',
    type: 'artboard',
    x: 80,
    y: 80,
    width: 380,
    height: 520,
    fill: '#181820',
    stroke: '#2E2E38',
    strokeWidth: 1,
    borderRadius: 16,
    shadow: '0 20px 40px rgba(0,0,0,0.5)'
  },
  {
    id: 'art-a-header',
    name: 'عنوان العرض',
    type: 'text',
    x: 110,
    y: 120,
    width: 320,
    height: 35,
    content: 'تجربة التحريك التفاعلي',
    fontSize: 20,
    fontWeight: '700',
    textColor: '#ECECF1',
    textAlign: 'center',
    parentId: 'artboard-a'
  },
  {
    id: 'art-a-desc',
    name: 'نص الوصف',
    type: 'text',
    x: 110,
    y: 165,
    width: 320,
    height: 50,
    content: 'اضغط على زر الإرسال لمشاهدة محرك Auto-Animate وهو يحسب منحنى Cubic-Bezier بين الشاشتين تلقائياً.',
    fontSize: 13,
    textColor: '#8E8EA0',
    textAlign: 'center',
    parentId: 'artboard-a'
  },
  {
    id: 'art-a-card',
    name: 'بطاقة الإدخال',
    type: 'rectangle',
    x: 115,
    y: 235,
    width: 310,
    height: 120,
    fill: '#22222B',
    borderRadius: 12,
    stroke: '#33333E',
    strokeWidth: 1,
    parentId: 'artboard-a'
  },
  {
    id: 'art-a-card-txt',
    name: 'نص الإدخال',
    type: 'text',
    x: 135,
    y: 280,
    width: 270,
    height: 25,
    content: 'المشروع جاهز لاستقبال وكلاء الذكاء الاصطناعي...',
    fontSize: 13,
    textColor: '#A0A0B2',
    textAlign: 'right',
    parentId: 'artboard-a'
  },
  // The interactive button in Artboard A (width: 40px, id: btn_submit, opacity: 0.8)
  {
    id: 'btn-submit-a',
    name: 'زر الإرسال (btn_submit)',
    type: 'button',
    x: 120,
    y: 400,
    width: 140,
    height: 48,
    fill: '#FF3366',
    borderRadius: 10,
    opacity: 0.85,
    content: 'إرسال الطلب',
    fontSize: 14,
    fontWeight: '600',
    textColor: '#FFFFFF',
    textAlign: 'center',
    transitionKey: 'btn_submit',
    parentId: 'artboard-a'
  },

  // Artboard B: Animated Final State (Expanded button: 200px, opacity: 1.0, positioned further right)
  {
    id: 'artboard-b',
    name: 'الشاشة B (الحالة النهائية للتحريك)',
    type: 'artboard',
    x: 520,
    y: 80,
    width: 380,
    height: 520,
    fill: '#181820',
    stroke: '#FF3366',
    strokeWidth: 1.5,
    borderRadius: 16,
    shadow: '0 25px 50px rgba(255, 51, 102, 0.15)'
  },
  {
    id: 'art-b-header',
    name: 'عنوان النجاح',
    type: 'text',
    x: 550,
    y: 120,
    width: 320,
    height: 35,
    content: 'تم تفعيل وكيل ديب سيك!',
    fontSize: 20,
    fontWeight: '700',
    textColor: '#00D2FF',
    textAlign: 'center',
    parentId: 'artboard-b'
  },
  {
    id: 'art-b-desc',
    name: 'نص الوصف',
    type: 'text',
    x: 550,
    y: 165,
    width: 320,
    height: 50,
    content: 'استجاب المحرك بسرعة 60 إطاراً بالثانية وتم اشتقاق التحول اللحظي دون إعادة تحميل الشجرة.',
    fontSize: 13,
    textColor: '#ECECF1',
    textAlign: 'center',
    parentId: 'artboard-b'
  },
  {
    id: 'art-b-circle',
    name: 'مؤشر الحالة النابض',
    type: 'circle',
    x: 670,
    y: 250,
    width: 80,
    height: 80,
    fill: 'rgba(0, 210, 255, 0.2)',
    stroke: '#00D2FF',
    strokeWidth: 2,
    parentId: 'artboard-b'
  },
  // The interactive button in Artboard B (expanded to width: 280px, opacity: 1.0)
  {
    id: 'btn-submit-b',
    name: 'زر الإرسال الممتد (btn_submit)',
    type: 'button',
    x: 570,
    y: 400,
    width: 280,
    height: 48,
    fill: '#FF3366',
    borderRadius: 10,
    opacity: 1.0,
    content: '✓ تم التنفيذ بنجاح بواسطة DeepSeek',
    fontSize: 14,
    fontWeight: '700',
    textColor: '#FFFFFF',
    textAlign: 'center',
    transitionKey: 'btn_submit',
    parentId: 'artboard-b'
  }
];

interface StudioContextType {
  nodes: SceneNode[];
  selectedIds: string[];
  activeTool: ToolType;
  zoom: number;
  pan: { x: number; y: number };
  tokens: DesignToken[];
  activeTab: 'layers' | 'tokens' | 'inspect' | 'ai';
  previewAnimation: boolean;
  deepSeekConfig: DeepSeekConfig;
  activeAgent: AIAgent;
  chatMessages: AgentChatMessage[];
  isAgentGenerating: boolean;
  
  // Actions
  setActiveTool: (tool: ToolType) => void;
  setActiveTab: (tab: 'layers' | 'tokens' | 'inspect' | 'ai') => void;
  setSelectedIds: (ids: string[]) => void;
  selectNode: (id: string, multiple?: boolean) => void;
  clearSelection: () => void;
  
  addNode: (node: Partial<SceneNode>) => void;
  updateNode: (id: string, updates: Partial<SceneNode>) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  reorderNode: (id: string, direction: 'up' | 'down') => void;
  
  setZoom: (z: number | ((prev: number) => number)) => void;
  setPan: (p: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  resetView: () => void;
  
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  setPreviewAnimation: (show: boolean) => void;
  
  // DeepSeek AI Actions
  setActiveAgentRole: (role: AIAgentRole) => void;
  updateDeepSeekConfig: (cfg: Partial<DeepSeekConfig>) => void;
  sendAgentPrompt: (prompt: string) => Promise<void>;
  applyAgentNodes: (nodes: SceneNode[]) => void;
  clearChat: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<SceneNode[]>(INITIAL_NODES);
  const [selectedIds, setSelectedIds] = useState<string[]>(['artboard-a']);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 40, y: 30 });
  const [tokens] = useState<DesignToken[]>(INITIAL_TOKENS);
  const [activeTab, setActiveTab] = useState<'layers' | 'tokens' | 'inspect' | 'ai'>('ai');
  const [previewAnimation, setPreviewAnimation] = useState<boolean>(false);
  
  // Undo/Redo history
  const [historyPast, setHistoryPast] = useState<SceneNode[][]>([]);
  const [historyFuture, setHistoryFuture] = useState<SceneNode[][]>([]);
  
  // DeepSeek AI State
  const [deepSeekConfig, setDeepSeekConfig] = useState<DeepSeekConfig>(DEFAULT_DEEPSEEK_CONFIG);
  const [activeAgentRole, setActiveAgentRole] = useState<AIAgentRole>('architect');
  const [isAgentGenerating, setIsAgentGenerating] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'system',
      text: 'مرحباً بك في InVision Studio AI! ✨\nتم تفعيل وحدة وكلاء الذكاء الاصطناعي مع دعم محرك **ديب سيك (DeepSeek)** لتصميم الواجهات، وإدارة نظم التصميم وتوليد الأكواد تلقائياً.',
      timestamp: Date.now()
    },
    {
      id: 'welcome-2',
      sender: 'agent',
      agentRole: 'architect',
      text: 'أنا **وكيل معمار الواجهات (DeepSeek Architect)**.\nيمكنك طلبي لتصميم بطاقات، شاشات، أزرار، أو لوحات تحكم كاملة وسأقوم بإسقاطها فوراً على مساحة العمل المتجهة (Scene Graph). جرب كتابة: "صمم بطاقة إحصاءات مالية" أو "أنشئ واجهة تسجيل دخول".',
      timestamp: Date.now() + 100
    }
  ]);

  const activeAgent = AI_AGENTS.find(a => a.id === activeAgentRole) || AI_AGENTS[0];

  const pushHistory = (newNodes: SceneNode[]) => {
    setHistoryPast(prev => [...prev.slice(-25), nodes]);
    setHistoryFuture([]);
  };

  const undo = () => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    setHistoryFuture(prev => [nodes, ...prev]);
    setHistoryPast(prev => prev.slice(0, prev.length - 1));
    setNodes(previous);
  };

  const redo = () => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    setHistoryPast(prev => [...prev, nodes]);
    setHistoryFuture(prev => prev.slice(1));
    setNodes(next);
  };

  const selectNode = (id: string, multiple = false) => {
    if (multiple) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setSelectedIds([id]);
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const addNode = (nodeData: Partial<SceneNode>) => {
    pushHistory(nodes);
    const id = 'node-' + Date.now();
    const newNode: SceneNode = {
      id,
      name: nodeData.name || `عنصر ${nodes.length + 1}`,
      type: nodeData.type || 'rectangle',
      x: nodeData.x || 200,
      y: nodeData.y || 200,
      width: nodeData.width || 160,
      height: nodeData.height || 100,
      fill: nodeData.fill || '#1E1E24',
      stroke: nodeData.stroke || '#33333E',
      strokeWidth: nodeData.strokeWidth || 1,
      borderRadius: nodeData.borderRadius || 8,
      opacity: nodeData.opacity ?? 1,
      ...nodeData
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedIds([id]);
  };

  const updateNode = (id: string, updates: Partial<SceneNode>) => {
    pushHistory(nodes);
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    pushHistory(nodes);
    setNodes(prev => prev.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const duplicateSelected = () => {
    if (selectedIds.length === 0) return;
    pushHistory(nodes);
    const duplicates: SceneNode[] = [];
    const newSelectedIds: string[] = [];
    
    nodes.forEach(n => {
      if (selectedIds.includes(n.id)) {
        const newId = 'copy-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
        duplicates.push({
          ...n,
          id: newId,
          name: `${n.name} (نسخة)`,
          x: n.x + 30,
          y: n.y + 30
        });
        newSelectedIds.push(newId);
      }
    });

    setNodes(prev => [...prev, ...duplicates]);
    setSelectedIds(newSelectedIds);
  };

  const reorderNode = (id: string, direction: 'up' | 'down') => {
    const idx = nodes.findIndex(n => n.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx < nodes.length - 1) {
      pushHistory(nodes);
      const newNodes = [...nodes];
      const temp = newNodes[idx];
      newNodes[idx] = newNodes[idx + 1];
      newNodes[idx + 1] = temp;
      setNodes(newNodes);
    } else if (direction === 'down' && idx > 0) {
      pushHistory(nodes);
      const newNodes = [...nodes];
      const temp = newNodes[idx];
      newNodes[idx] = newNodes[idx - 1];
      newNodes[idx - 1] = temp;
      setNodes(newNodes);
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 40, y: 30 });
  };

  // DeepSeek AI prompt handling
  const sendAgentPrompt = async (prompt: string) => {
    if (!prompt.trim() || isAgentGenerating) return;

    const userMsg: AgentChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: prompt,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAgentGenerating(true);

    try {
      const selectedNodes = nodes.filter(n => selectedIds.includes(n.id));
      const res = await callDeepSeekAgent(
        activeAgentRole,
        prompt,
        deepSeekConfig,
        { selectedNodes, allNodes: nodes }
      );

      const agentMsg: AgentChatMessage = {
        id: 'reply-' + Date.now(),
        sender: 'agent',
        agentRole: activeAgentRole,
        text: res.text,
        actionPayload: res.actionPayload,
        timestamp: Date.now()
      };

      setChatMessages(prev => [...prev, agentMsg]);

      // If the agent returned canvas nodes automatically, offer to apply or auto-select
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'system',
          text: `خطأ أثناء تنفيذ الوكيل: ${err.message}`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsAgentGenerating(false);
    }
  };

  const applyAgentNodes = (newNodes: SceneNode[]) => {
    pushHistory(nodes);
    setNodes(prev => [...prev, ...newNodes]);
    setSelectedIds(newNodes.map(n => n.id));
  };

  const updateDeepSeekConfig = (cfg: Partial<DeepSeekConfig>) => {
    setDeepSeekConfig(prev => {
      const updated = { ...prev, ...cfg };
      if (cfg.apiKey !== undefined) {
        localStorage.setItem('invision_deepseek_api_key', cfg.apiKey);
      }
      return updated;
    });
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'msg-reset',
        sender: 'system',
        text: 'تمت إعادة تعيين محادثة الوكيل.',
        timestamp: Date.now()
      }
    ]);
  };

  return (
    <StudioContext.Provider
      value={{
        nodes,
        selectedIds,
        activeTool,
        zoom,
        pan,
        tokens,
        activeTab,
        previewAnimation,
        deepSeekConfig,
        activeAgent,
        chatMessages,
        isAgentGenerating,
        setActiveTool,
        setActiveTab,
        setSelectedIds,
        selectNode,
        clearSelection,
        addNode,
        updateNode,
        deleteSelected,
        duplicateSelected,
        reorderNode,
        setZoom,
        setPan,
        resetView,
        undo,
        redo,
        canUndo: historyPast.length > 0,
        canRedo: historyFuture.length > 0,
        setPreviewAnimation,
        setActiveAgentRole,
        updateDeepSeekConfig,
        sendAgentPrompt,
        applyAgentNodes,
        clearChat
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within StudioProvider');
  return ctx;
};

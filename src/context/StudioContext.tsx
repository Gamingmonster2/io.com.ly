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
    nameAr: 'معمار الواجهات المتجهة',
    descriptionAr: 'توليد عناصر وشاشات متجهة كاملة مباشرة على مساحة العمل',
    avatar: '📐',
    color: '#FF3366'
  },
  {
    id: 'code',
    name: 'DeepSeek Live Code & Tailwind',
    nameAr: 'مبرمج الكود الحي (Tailwind)',
    descriptionAr: 'كتابة وتطبيق كود HTML و Tailwind مباشرة على مساحة العمل ورؤية النتيجة فوراً',
    avatar: '💻',
    color: '#00D2FF'
  },
  {
    id: 'tokens',
    name: 'DeepSeek Design Tokens',
    nameAr: 'نظم التصميم والرموز',
    descriptionAr: 'توليد ومواءمة لوحات الألوان ومقاييس الخطوط وهوامش الفراغات',
    avatar: '🎨',
    color: '#7928CA'
  },
  {
    id: 'auditor',
    name: 'DeepSeek UX Auditor',
    nameAr: 'مدقق التباين وسهولة الاستخدام',
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

  // Artboard B: Animated Final State
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
  activeTab: 'layers' | 'tokens' | 'inspect';
  previewAnimation: boolean;
  deepSeekConfig: DeepSeekConfig;
  activeAgent: AIAgent;
  chatMessages: AgentChatMessage[];
  isAgentGenerating: boolean;
  
  // Collapsible Layout State
  isLeftSidebarOpen: boolean;
  setIsLeftSidebarOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isAIBottomBarExpanded: boolean;
  setIsAIBottomBarExpanded: (val: boolean | ((prev: boolean) => boolean)) => void;
  autoApplyAI: boolean;
  setAutoApplyAI: (val: boolean) => void;
  lastAppliedNotification: string | null;

  // Actions
  setActiveTool: (tool: ToolType) => void;
  setActiveTab: (tab: 'layers' | 'tokens' | 'inspect') => void;
  setSelectedIds: (ids: string[]) => void;
  selectNode: (id: string, multiple?: boolean) => void;
  clearSelection: () => void;
  
  addNode: (node: Partial<SceneNode>) => void;
  addLiveCodeNode: (name: string, code: string, width?: number, height?: number) => void;
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
  const [activeTab, setActiveTab] = useState<'layers' | 'tokens' | 'inspect'>('layers');
  const [previewAnimation, setPreviewAnimation] = useState<boolean>(false);
  
  // Collapsible Layout States: maximum canvas space by default!
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(false); // Collapsed by default for spacious canvas
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true); // Collapsible
  const [isAIBottomBarExpanded, setIsAIBottomBarExpanded] = useState<boolean>(false);
  const [autoApplyAI, setAutoApplyAI] = useState<boolean>(true); // Auto-apply code & designs directly to canvas!
  const [lastAppliedNotification, setLastAppliedNotification] = useState<string | null>(null);

  // Undo/Redo history
  const [historyPast, setHistoryPast] = useState<SceneNode[][]>([]);
  const [historyFuture, setHistoryFuture] = useState<SceneNode[][]>([]);
  
  // DeepSeek AI State
  const [deepSeekConfig, setDeepSeekConfig] = useState<DeepSeekConfig>(DEFAULT_DEEPSEEK_CONFIG);
  const [activeAgentRole, setActiveAgentRole] = useState<AIAgentRole>('code'); // Start with code agent!
  const [isAgentGenerating, setIsAgentGenerating] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'system',
      text: 'مرحباً بك! ✨ شريط وكلاء ديب سيك متاح بالأسفل، وأي كود أو تصميم تطلبه سيتم تطبيقه وتنفيذه فوراً وبشكل مرئي على مساحة العمل.',
      timestamp: Date.now()
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
      x: nodeData.x || 300,
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
    return id;
  };

  // Add Live Code Node that executes and renders HTML/Tailwind visually on canvas
  const addLiveCodeNode = (name: string, code: string, width = 340, height = 240) => {
    pushHistory(nodes);
    const id = 'live-code-' + Date.now();
    const spawnX = Math.round(-pan.x + 280 + Math.random() * 40);
    const spawnY = Math.round(-pan.y + 120 + Math.random() * 40);

    const newNode: SceneNode = {
      id,
      name: name || 'مكون كود حي (Tailwind)',
      type: 'live_code',
      x: Math.max(40, spawnX),
      y: Math.max(40, spawnY),
      width,
      height,
      codeSnippet: code,
      fill: 'transparent',
      borderRadius: 16,
      opacity: 1
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedIds([id]);
    showToast(`⚡ تم تطبيق كود "${newNode.name}" مباشرة على مساحة العمل!`);
  };

  const showToast = (msg: string) => {
    setLastAppliedNotification(msg);
    setTimeout(() => {
      setLastAppliedNotification(null);
    }, 4000);
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

  // DeepSeek AI prompt handling with DIRECT CANVAS APPLICATION
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

      // DIRECT APPLICATION: If autoApplyAI is active, apply the code/design instantly to canvas!
      if (autoApplyAI && res.actionPayload) {
        if (res.actionPayload.type === 'ADD_LIVE_CODE' && res.actionPayload.code) {
          addLiveCodeNode(
            res.actionPayload.name || 'مكون كود حي',
            res.actionPayload.code,
            res.actionPayload.width || 340,
            res.actionPayload.height || 240
          );
        } else if (res.actionPayload.type === 'ADD_NODES' && res.actionPayload.nodes) {
          applyAgentNodes(res.actionPayload.nodes);
          showToast(`✨ تم إدراج ${res.actionPayload.nodes.length} كائنات على مساحة العمل مباشرة!`);
        }
      }
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
        isLeftSidebarOpen,
        setIsLeftSidebarOpen,
        isInspectorOpen,
        setIsInspectorOpen,
        isAIBottomBarExpanded,
        setIsAIBottomBarExpanded,
        autoApplyAI,
        setAutoApplyAI,
        lastAppliedNotification,
        setActiveTool,
        setActiveTab,
        setSelectedIds,
        selectNode,
        clearSelection,
        addNode,
        addLiveCodeNode,
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

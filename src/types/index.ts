export type NodeType = 
  | 'artboard'
  | 'rectangle'
  | 'circle'
  | 'text'
  | 'button'
  | 'card'
  | 'input'
  | 'live_code';

export interface SceneNode {
  id: string;
  name: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  parentId?: string | null; // For artboard nesting or grouping
  
  // Visual Styles
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  shadow?: string;
  
  // Typography
  content?: string;
  fontSize?: number;
  fontWeight?: string | number;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  
  // Live Code Execution (Custom HTML + Tailwind rendered live on canvas)
  codeSnippet?: string;
  
  // Component / Overrides System
  isMasterComponent?: boolean;
  masterId?: string; // If this node is an instance of a master component
  overrides?: Record<string, any>;
  
  // Animation / Auto-Animate Keyframe metadata
  transitionKey?: string; // Matching ID between artboards for auto-animate
}

export interface DesignToken {
  id: string;
  name: string;
  key: string; // e.g. color.brand.primary
  value: string;
  category: 'color' | 'typography' | 'spacing';
  description?: string;
}

export type ToolType = 
  | 'select'
  | 'artboard'
  | 'rectangle'
  | 'circle'
  | 'text'
  | 'button'
  | 'pan';

export interface DeepSeekConfig {
  apiKey: string;
  model: 'deepseek-chat' | 'deepseek-coder' | 'deepseek-reasoner';
  baseUrl: string;
  temperature: number;
}

export type AIAgentRole = 
  | 'architect'    // UI/UX Canvas Architect
  | 'tokens'       // Design Tokens & Themes
  | 'code'         // Developer Handoff / Code Generator
  | 'auditor';     // UX & Accessibility Reviewer

export interface AIAgent {
  id: AIAgentRole;
  name: string;
  nameAr: string;
  descriptionAr: string;
  avatar: string;
  color: string;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentRole?: AIAgentRole;
  text: string;
  timestamp: number;
  actionPayload?: {
    type: string;
    nodes?: SceneNode[];
    data?: any;
    [key: string]: any;
  };
}

import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  Box, 
  ExternalLink 
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const HandoffPanel: React.FC = () => {
  const { nodes, selectedIds, setActiveTab, sendAgentPrompt, setActiveAgentRole } = useStudio();
  const [activeLang, setActiveLang] = useState<'css' | 'tailwind' | 'react' | 'swiftui' | 'compose'>('tailwind');
  const [copied, setCopied] = useState(false);

  const selectedNode = nodes.find(n => selectedIds.includes(n.id)) || nodes[0];

  const getCssCode = () => {
    if (!selectedNode) return '/* حدد عنصراً لعرض خصائص CSS */';
    return `/* InVision Studio Export - ${selectedNode.name} */
.element-${selectedNode.id.replace(/[^a-zA-Z0-9]/g, '_')} {
  position: absolute;
  width: ${Math.round(selectedNode.width)}px;
  height: ${Math.round(selectedNode.height)}px;
  background-color: ${selectedNode.fill || 'transparent'};
  border-radius: ${selectedNode.borderRadius || 0}px;
  opacity: ${selectedNode.opacity ?? 1};
  ${selectedNode.stroke ? `border: ${selectedNode.strokeWidth || 1}px solid ${selectedNode.stroke};` : ''}
  ${selectedNode.shadow ? `box-shadow: ${selectedNode.shadow};` : ''}
  ${selectedNode.fontSize ? `font-size: ${selectedNode.fontSize}px;` : ''}
  ${selectedNode.textColor ? `color: ${selectedNode.textColor};` : ''}
  transition: all 350ms cubic-bezier(0.4, 0.0, 0.2, 1);
}`;
  };

  const getTailwindCode = () => {
    if (!selectedNode) return '<div className="..."></div>';
    const isRound = (selectedNode.borderRadius || 0) > 20;
    return `<!-- Tailwind CSS Component: ${selectedNode.name} -->
<div className="w-[${Math.round(selectedNode.width)}px] h-[${Math.round(selectedNode.height)}px] flex items-center justify-center transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
      isRound ? 'rounded-full' : 'rounded-xl'
    } shadow-lg"
  style={{
    backgroundColor: '${selectedNode.fill || '#1E1E24'}',
    ${selectedNode.stroke ? `borderColor: '${selectedNode.stroke}', borderWidth: '${selectedNode.strokeWidth || 1}px',` : ''}
  }}
>
  <span className="font-medium text-white text-sm">
    ${selectedNode.content || selectedNode.name}
  </span>
</div>`;
  };

  const getReactCode = () => {
    if (!selectedNode) return '';
    const compName = selectedNode.name.replace(/[^a-zA-Z0-9]/g, '') || 'CustomElement';
    return `import React from 'react';

export const ${compName}: React.FC = () => {
  return (
    <div 
      className="relative flex items-center justify-center transition-transform hover:shadow-2xl"
      style={{
        width: '${Math.round(selectedNode.width)}px',
        height: '${Math.round(selectedNode.height)}px',
        backgroundColor: '${selectedNode.fill || '#1E1E24'}',
        borderRadius: '${selectedNode.borderRadius || 0}px',
        opacity: ${selectedNode.opacity ?? 1},
      }}
    >
      <span style={{ color: '${selectedNode.textColor || '#FFF'}', fontSize: '${selectedNode.fontSize || 14}px' }}>
        ${selectedNode.content || selectedNode.name}
      </span>
    </div>
  );
};`;
  };

  const getSwiftUICode = () => {
    if (!selectedNode) return '';
    return `// SwiftUI View
struct ${selectedNode.name.replace(/[^a-zA-Z0-9]/g, '') || 'StudioView'}: View {
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: ${selectedNode.borderRadius || 12})
                .fill(Color(hex: "${selectedNode.fill || '#1E1E24'}"))
                .frame(width: ${Math.round(selectedNode.width)}, height: ${Math.round(selectedNode.height)})
                .shadow(radius: 8)
            
            Text("${selectedNode.content || selectedNode.name}")
                .font(.system(size: ${selectedNode.fontSize || 14}, weight: .semibold))
                .foregroundColor(.white)
        }
        .animation(.easeInOut(duration: 0.35), value: isExpanded)
    }
}`;
  };

  const getComposeCode = () => {
    if (!selectedNode) return '';
    return `// Jetpack Compose
@Composable
fun ${selectedNode.name.replace(/[^a-zA-Z0-9]/g, '') || 'StudioElement'}() {
    Box(
        modifier = Modifier
            .size(${Math.round(selectedNode.width)}.dp, ${Math.round(selectedNode.height)}.dp)
            .clip(RoundedCornerShape(${selectedNode.borderRadius || 12}.dp))
            .background(Color(android.graphics.Color.parseColor("${selectedNode.fill || '#1E1E24'}")))
            .shadow(elevation = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "${selectedNode.content || selectedNode.name}",
            color = Color.White,
            fontSize = ${selectedNode.fontSize || 14}.sp
        )
    }
}`;
  };

  const getCurrentCode = () => {
    switch (activeLang) {
      case 'css': return getCssCode();
      case 'tailwind': return getTailwindCode();
      case 'react': return getReactCode();
      case 'swiftui': return getSwiftUICode();
      case 'compose': return getComposeCode();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeepSeekEnhance = () => {
    setActiveAgentRole('code');
    setActiveTab('ai');
    sendAgentPrompt(`قم بتحسين وتوليد مكون كود متكامل للعنصر: ${selectedNode?.name} مع إضافة حالات التفاعل (Hover/Active) واقتراح معايير الأداء.`);
  };

  return (
    <div className="w-80 bg-studio-panel border-r border-studio-border flex flex-col h-full select-none z-10 text-xs">
      {/* Header */}
      <div className="p-3 border-b border-studio-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold uppercase tracking-wide text-white">تفتيش المطورين (Developer Handoff)</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded bg-studio-subpanel hover:bg-studio-hover border border-studio-border text-[11px] text-white transition active:scale-95"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-studio-muted" />}
          <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Selected element badge */}
        <div className="bg-studio-subpanel/60 p-2.5 rounded-lg border border-studio-border flex items-center justify-between">
          <div>
            <span className="text-[10px] text-studio-muted block">العنصر المفحوص:</span>
            <span className="font-medium text-white text-xs">{selectedNode?.name || 'لم يتم التحديد'}</span>
          </div>
          <span className="font-mono text-[11px] text-cyan-400">
            {Math.round(selectedNode?.width || 0)}×{Math.round(selectedNode?.height || 0)} px
          </span>
        </div>

        {/* Box Model visualizer (PDF Requirement!) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-studio-muted text-[11px] font-medium">
            <Box className="w-3.5 h-3.5 text-studio-accent" />
            <span>مخطط الصندوق (Box Model)</span>
          </div>

          <div className="bg-studio-bg border border-studio-border rounded-lg p-3 text-center">
            {/* Margin box */}
            <div className="border border-dashed border-amber-500/40 bg-amber-500/5 p-2 rounded text-[10px] text-amber-300">
              <span className="block text-[9px] text-studio-muted mb-1">Margin: auto</span>
              {/* Padding box */}
              <div className="border border-emerald-500/40 bg-emerald-500/10 p-2 rounded text-[10px] text-emerald-300">
                <span className="block text-[9px] text-studio-muted mb-1">Padding: 16px</span>
                {/* Content Box */}
                <div className="bg-studio-panel border border-studio-border py-1.5 px-2 rounded font-mono text-[11px] text-white">
                  {Math.round(selectedNode?.width || 0)} × {Math.round(selectedNode?.height || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="space-y-1.5">
          <span className="text-studio-muted text-[11px] font-medium">صيغة الكود المستهدفة</span>
          <div className="grid grid-cols-3 gap-1 bg-studio-subpanel p-1 rounded-lg border border-studio-border">
            {[
              { id: 'tailwind', label: 'Tailwind' },
              { id: 'css', label: 'CSS' },
              { id: 'react', label: 'React' },
              { id: 'swiftui', label: 'SwiftUI' },
              { id: 'compose', label: 'Compose' },
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => setActiveLang(lang.id as any)}
                className={`py-1 rounded text-center text-[10px] font-medium transition ${
                  activeLang === lang.id
                    ? 'bg-studio-accent text-white shadow-sm'
                    : 'text-studio-muted hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code block */}
        <div className="relative">
          <pre className="bg-studio-bg border border-studio-border rounded-lg p-3 text-[11px] font-mono text-studio-text overflow-x-auto max-h-52 leading-relaxed">
            <code>{getCurrentCode()}</code>
          </pre>
        </div>

        {/* DeepSeek Code Engine Prompt banner */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-950/40 to-blue-950/30 border border-cyan-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>تسليم ذكي عبر DeepSeek</span>
          </div>
          <p className="text-[11px] text-studio-muted leading-relaxed">
            اطلب من وكيل ديب سيك توليد مكون React متكامل مع الخطافات (Hooks)، وإدارة الحالة، واختبارات الوحدة.
          </p>
          <button
            onClick={handleDeepSeekEnhance}
            className="w-full py-1.5 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-medium transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>توليد كود إنتاجي متقدم</span>
          </button>
        </div>
      </div>
    </div>
  );
};

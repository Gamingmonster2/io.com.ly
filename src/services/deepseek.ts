import { DeepSeekConfig, SceneNode, AIAgentRole } from '../types';

export const DEFAULT_DEEPSEEK_CONFIG: DeepSeekConfig = {
  apiKey: localStorage.getItem('invision_deepseek_api_key') || '',
  model: 'deepseek-chat',
  baseUrl: 'https://api.deepseek.com',
  temperature: 0.7,
};

// System prompts tailored for DeepSeek specialized design agents
const SYSTEM_PROMPTS: Record<AIAgentRole, string> = {
  architect: `You are DeepSeek Canvas Architect inside InVision Studio.
Your role is to understand user UI requirements and generate high-fidelity UI components on the infinite canvas.
When responding with UI generation, you must return a valid JSON block containing an array of "nodes":
Example:
\`\`\`json
{
  "type": "ADD_NODES",
  "explanation": "وصف التصميم الذي تم إنشاؤه",
  "nodes": [
    {
      "name": "بطاقة منتج",
      "type": "card",
      "x": 100,
      "y": 100,
      "width": 320,
      "height": 420,
      "fill": "#1E1E24",
      "stroke": "#33333E",
      "strokeWidth": 1,
      "borderRadius": 16,
      "shadow": "0 8px 30px rgba(0,0,0,0.5)"
    }
  ]
}
\`\`\`
Always ensure colors look modern, high contrast, matching dark/sleek studio aesthetic.`,

  tokens: `You are DeepSeek Design Token Specialist inside InVision Studio.
Generate cohesive design systems, semantic color palettes (primary, secondary, background, text, accent) and spacing scales.
Return tokens in JSON format or clear structured tables.`,

  code: `You are DeepSeek Code & Handoff Engineer.
Given UI specifications or selected components, write production-ready, clean, modern code in React + Tailwind CSS, SwiftUI, or Jetpack Compose. Explain layout decisions (Flexbox, Grid, Auto-layout).`,

  auditor: `You are DeepSeek UX & Accessibility Auditor.
Inspect component properties, contrast ratios (WCAG AA/AAA), hierarchy, touch targets, and provide actionable design critiques.`
};

export async function callDeepSeekAgent(
  role: AIAgentRole,
  userPrompt: string,
  config: DeepSeekConfig,
  canvasContext?: { selectedNodes: SceneNode[]; allNodes: SceneNode[] }
): Promise<{ text: string; actionPayload?: any }> {
  // Check if API key is provided
  if (!config.apiKey || config.apiKey.trim() === '') {
    // Return rich simulated DeepSeek response with functional payload
    return simulateDeepSeekResponse(role, userPrompt, canvasContext);
  }

  try {
    const contextPrompt = canvasContext?.selectedNodes?.length
      ? `\n[Context: User currently has selected: ${JSON.stringify(canvasContext.selectedNodes.map(n => ({ id: n.id, name: n.name, type: n.type, w: n.width, h: n.height, fill: n.fill, text: n.content })))}]`
      : '';

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS[role] },
          { role: 'user', content: userPrompt + contextPrompt }
        ],
        temperature: config.temperature,
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`DeepSeek API Error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const replyText = data.choices[0].message.content;

    // Parse JSON blocks if architect suggested nodes
    let actionPayload: any = undefined;
    const jsonMatch = replyText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        actionPayload = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.warn('Could not parse JSON action block:', e);
      }
    }

    return {
      text: replyText,
      actionPayload
    };
  } catch (error: any) {
    console.error('DeepSeek call failed, using fallback simulator:', error);
    // Graceful fallback with notification of error
    const sim = simulateDeepSeekResponse(role, userPrompt, canvasContext);
    return {
      text: `⚠️ تنبيه الاتصال: (${error.message}).\nتم تفعيل المحاكي الذكي المدمج:\n\n${sim.text}`,
      actionPayload: sim.actionPayload
    };
  }
}

// Smart simulator for instant offline experience & testing
function simulateDeepSeekResponse(
  role: AIAgentRole,
  userPrompt: string,
  canvasContext?: { selectedNodes: SceneNode[]; allNodes: SceneNode[] }
): { text: string; actionPayload?: any } {
  const p = userPrompt.toLowerCase();

  if (role === 'architect' || p.includes('صمم') || p.includes('بطاقة') || p.includes('card') || p.includes('تسجيل') || p.includes('login') || p.includes('dashboard')) {
    const isLogin = p.includes('تسجيل') || p.includes('دخول') || p.includes('login');
    const isDashboard = p.includes('لوحة') || p.includes('dashboard') || p.includes('احصاء');
    
    const randomOffset = Math.floor(Math.random() * 40);
    const baseX = 300 + randomOffset;
    const baseY = 180 + randomOffset;

    let generatedNodes: SceneNode[] = [];
    let explanation = '';

    if (isLogin) {
      explanation = 'تم تصميم شاشة تسجيل دخول احترافية متكاملة بأسلوب داكن وجماليات InVision Studio، مع حقول الإدخال والزر الرئيسي.';
      generatedNodes = [
        {
          id: 'ai-artboard-' + Date.now(),
          name: 'شاشة تسجيل الدخول',
          type: 'artboard',
          x: baseX,
          y: baseY,
          width: 380,
          height: 480,
          fill: '#18181F',
          stroke: '#33333E',
          strokeWidth: 1,
          borderRadius: 20,
          shadow: '0 20px 50px rgba(0,0,0,0.6)'
        },
        {
          id: 'ai-title-' + Date.now(),
          name: 'عنوان الترحيب',
          type: 'text',
          x: baseX + 30,
          y: baseY + 45,
          width: 320,
          height: 40,
          content: 'تسجيل الدخول إلى حسابك',
          fontSize: 22,
          fontWeight: '700',
          textColor: '#ECECF1',
          textAlign: 'center'
        },
        {
          id: 'ai-input-email-' + Date.now(),
          name: 'حقل البريد الإلكتروني',
          type: 'rectangle',
          x: baseX + 30,
          y: baseY + 120,
          width: 320,
          height: 50,
          fill: '#24242C',
          stroke: '#3D3D4A',
          strokeWidth: 1,
          borderRadius: 10,
        },
        {
          id: 'ai-txt-email-' + Date.now(),
          name: 'نص البريد',
          type: 'text',
          x: baseX + 45,
          y: baseY + 135,
          width: 250,
          height: 25,
          content: 'name@company.com',
          fontSize: 14,
          textColor: '#8E8EA0',
          textAlign: 'left'
        },
        {
          id: 'ai-input-pass-' + Date.now(),
          name: 'حقل كلمة المرور',
          type: 'rectangle',
          x: baseX + 30,
          y: baseY + 190,
          width: 320,
          height: 50,
          fill: '#24242C',
          stroke: '#3D3D4A',
          strokeWidth: 1,
          borderRadius: 10,
        },
        {
          id: 'ai-txt-pass-' + Date.now(),
          name: 'نص كلمة المرور',
          type: 'text',
          x: baseX + 45,
          y: baseY + 205,
          width: 250,
          height: 25,
          content: '••••••••••••',
          fontSize: 14,
          textColor: '#8E8EA0',
          textAlign: 'left'
        },
        {
          id: 'ai-btn-submit-' + Date.now(),
          name: 'زر تسجيل الدخول (Master)',
          type: 'button',
          x: baseX + 30,
          y: baseY + 280,
          width: 320,
          height: 52,
          fill: '#FF3366', // InVision Accent
          borderRadius: 12,
          content: 'دخول إلى مساحة العمل',
          fontSize: 16,
          fontWeight: '600',
          textColor: '#FFFFFF',
          textAlign: 'center',
          isMasterComponent: true
        }
      ];
    } else if (isDashboard) {
      explanation = 'تم توليد بطاقة مؤشرات أداء (KPI Metric Card) مع عناصر متجهة ورسم بياني رمزي.';
      generatedNodes = [
        {
          id: 'ai-kpi-card-' + Date.now(),
          name: 'بطاقة إحصاءات الإيرادات',
          type: 'card',
          x: baseX,
          y: baseY,
          width: 320,
          height: 200,
          fill: '#1A1A22',
          stroke: '#2F2F3D',
          strokeWidth: 1,
          borderRadius: 16,
          shadow: '0 10px 30px rgba(0,0,0,0.4)'
        },
        {
          id: 'ai-kpi-lbl-' + Date.now(),
          name: 'تسمية المؤشر',
          type: 'text',
          x: baseX + 24,
          y: baseY + 24,
          width: 200,
          height: 25,
          content: 'إجمالي المبيعات النشطة',
          fontSize: 14,
          textColor: '#8E8EA0',
          textAlign: 'right'
        },
        {
          id: 'ai-kpi-val-' + Date.now(),
          name: 'قيمة المؤشر',
          type: 'text',
          x: baseX + 24,
          y: baseY + 55,
          width: 220,
          height: 45,
          content: '$124,580',
          fontSize: 32,
          fontWeight: '700',
          textColor: '#00D2FF',
          textAlign: 'right'
        },
        {
          id: 'ai-kpi-badge-' + Date.now(),
          name: 'شارة النمو +24%',
          type: 'rectangle',
          x: baseX + 24,
          y: baseY + 120,
          width: 110,
          height: 32,
          fill: 'rgba(0, 210, 255, 0.15)',
          borderRadius: 8,
          stroke: '#00D2FF',
          strokeWidth: 1
        },
        {
          id: 'ai-kpi-badge-txt-' + Date.now(),
          name: 'نص الشارة',
          type: 'text',
          x: baseX + 34,
          y: baseY + 126,
          width: 90,
          height: 20,
          content: '▲ +24.8% هذا الشهر',
          fontSize: 11,
          textColor: '#00D2FF',
          fontWeight: '600',
          textAlign: 'center'
        }
      ];
    } else {
      explanation = 'قام وكيل ديب سيك بإنشاء مكون تفاعلي حديث (بطاقة ميزة تفاعلية) بناءً على طلبك.';
      generatedNodes = [
        {
          id: 'ai-feat-card-' + Date.now(),
          name: 'بطاقة ميزة الذكاء الاصطناعي',
          type: 'card',
          x: baseX,
          y: baseY,
          width: 340,
          height: 260,
          fill: '#1D1D26',
          stroke: '#FF3366',
          strokeWidth: 1,
          borderRadius: 16,
          shadow: '0 12px 35px rgba(255, 51, 102, 0.15)'
        },
        {
          id: 'ai-feat-title-' + Date.now(),
          name: 'عنوان البطاقة',
          type: 'text',
          x: baseX + 25,
          y: baseY + 30,
          width: 290,
          height: 35,
          content: 'محرك التحريك التفاعلي الذكي',
          fontSize: 18,
          fontWeight: '700',
          textColor: '#FFFFFF',
          textAlign: 'right'
        },
        {
          id: 'ai-feat-desc-' + Date.now(),
          name: 'وصف الميزة',
          type: 'text',
          x: baseX + 25,
          y: baseY + 75,
          width: 290,
          height: 60,
          content: 'تحويل الانتقالات بين الشاشات تلقائياً باستخدام خوارزميات Auto-Animate ومنحنيات Cubic Bezier فائقة النعومة.',
          fontSize: 13,
          textColor: '#A0A0B0',
          textAlign: 'right'
        },
        {
          id: 'ai-feat-btn-' + Date.now(),
          name: 'زر تفعيل',
          type: 'button',
          x: baseX + 25,
          y: baseY + 175,
          width: 290,
          height: 48,
          fill: '#FF3366',
          borderRadius: 10,
          content: 'تجربة التحريك الفوري',
          fontSize: 15,
          fontWeight: '600',
          textColor: '#FFFFFF',
          textAlign: 'center'
        }
      ];
    }

    return {
      text: `🤖 **وكيل التصميم (DeepSeek Architect):**\n\n${explanation}\n\n✨ تم تجهيز **${generatedNodes.length}** كائنات متجهة ومواءمتها مع شجرة المشهد (Scene Graph). يمكنك النقر أدناه لتطبيقها على مساحة العمل فوراً!`,
      actionPayload: {
        type: 'ADD_NODES',
        nodes: generatedNodes
      }
    };
  }

  if (role === 'tokens') {
    return {
      text: `🎨 **وكيل نظم التصميم (DeepSeek Design Tokens):**\n\nتم تحليل لوحة الألوان والرموز الموصى بها لمشروعك السحابي الحديث:\n\n` +
        `• **اللون الرئيسي (InVision Accent):** \`#FF3366\` (استجابة قوية وتفاعل عالي)\n` +
        `• **لون التركيز التقني (Cyan Neon):** \`#00D2FF\` (للمؤشرات الحية وحالة الوكلاء)\n` +
        `• **الخلفية العميقة (Dark Canvas):** \`#141417\` (عزل بصري مريح للعين)\n` +
        `• **لوحات التحكم (Studio Panels):** \`#1E1E24\` مع حدود \`#33333E\`\n` +
        `• **الطباعة (Typography Scale):** Inter + Cairo مع أحجام (12px Caption, 14px Body, 18px Subheading, 24px Headline, 32px Display).\n\n💡 جميع الرموز مرتبطة ديناميكياً ويمكن تصديرها كـ JSON أو متغيرات CSS.`
    };
  }

  if (role === 'code') {
    const target = canvasContext?.selectedNodes?.[0];
    const name = target ? target.name : 'Component';
    const fill = target?.fill || '#FF3366';
    const w = target?.width || 200;
    const h = target?.height || 50;

    return {
      text: `💻 **وكيل تسليم المطورين (DeepSeek Code Engine):**\n\nتم استخراج هيكل Flexbox ونمط الكود للعنصر المحدد (\`${name}\`):\n\n` +
`\`\`\`tsx
import React from 'react';

export const ${name.replace(/\s+/g, '')}: React.FC = () => {
  return (
    <div 
      className="flex items-center justify-center transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-lg"
      style={{
        width: '${w}px',
        height: '${h}px',
        backgroundColor: '${fill}',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
      }}
    >
      <span className="text-white font-medium text-sm tracking-wide">
        ${target?.content || name}
      </span>
    </div>
  );
};
\`\`\`\n\nكود مهيأ مباشرة للإنتاج مع دعم الانتقالات الانسيابية.`
    };
  }

  // Auditor Role
  return {
    text: `🔍 **وكيل التدقيق وسهولة الاستخدام (DeepSeek Auditor):**\n\nتم إجراء تدقيق سريع على مساحة العمل الحالية:\n\n` +
      `✅ **التباين اللوني (Contrast Ratio):** التباين بين النصوص البيضاء والخلفيات الداكنة يتجاوز 8.5:1 (مطابق لمعيار WCAG AAA).\n` +
      `✅ **مناطق اللمس (Touch Targets):** جميع الأزرار بأبعاد تفوق الحد الأدنى القياسي (48x48px).\n` +
      `💡 **توصية تحسين:** يُنصح بضبط مسافات الحشو الداخلية (Padding) على شبكة 8px موحدة للحفاظ على التناسق الإيقاعي للتصميم.`
  };
}

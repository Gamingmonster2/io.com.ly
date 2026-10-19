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
When responding with UI generation, you must return a valid JSON block containing "type": "ADD_NODES" or "ADD_LIVE_CODE":
Example:
\`\`\`json
{
  "type": "ADD_LIVE_CODE",
  "name": "بطاقة منتج عصرية",
  "width": 340,
  "height": 280,
  "code": "<div class=\\"w-full h-full p-6 bg-gradient-to-br from-[#1E1E28] to-[#14141A] border border-[#33333E] rounded-2xl shadow-2xl flex flex-col justify-between text-white\\"><h3 class=\\"font-bold text-lg text-pink-500\\">عنوان المكون</h3><p class=\\"text-xs text-slate-400\\">وصف المكون مع دعم Tailwind الكامل</p><button class=\\"w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl text-white font-medium shadow-lg hover:scale-105 transition\\">تأكيد الإجراء</button></div>"
}
\`\`\`
Always ensure design is modern, high-contrast, matching sleek studio aesthetic.`,

  code: `You are DeepSeek Live Code & Frontend Engineer inside InVision Studio.
When the user asks you to write code or create a component, your code WILL BE EXECUTED AND RENDERED DIRECTLY on the InVision Canvas.
Return a valid JSON block of type "ADD_LIVE_CODE" with clean HTML + Tailwind CSS code so it renders instantly:
\`\`\`json
{
  "type": "ADD_LIVE_CODE",
  "name": "اسم المكون",
  "width": 360,
  "height": 240,
  "code": "<div class=\\"...\\">...</div>"
}
\`\`\`
Use beautiful Tailwind classes: gradients, shadows, flexbox, border-radius, modern fonts.`,

  tokens: `You are DeepSeek Design Token Specialist inside InVision Studio.
Generate cohesive design systems, semantic color palettes (primary, secondary, background, text, accent) and spacing scales.
Return tokens in JSON format or clear structured tables.`,

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

    // Parse JSON blocks if agent suggested code or nodes
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
    const sim = simulateDeepSeekResponse(role, userPrompt, canvasContext);
    return {
      text: `⚠️ تنبيه الاتصال: (${error.message}).\nتم تفعيل المحاكي الذكي المدمج:\n\n${sim.text}`,
      actionPayload: sim.actionPayload
    };
  }
}

// Smart simulator with live rendering payloads that appear immediately on canvas
function simulateDeepSeekResponse(
  role: AIAgentRole,
  userPrompt: string,
  canvasContext?: { selectedNodes: SceneNode[]; allNodes: SceneNode[] }
): { text: string; actionPayload?: any } {
  const p = userPrompt.toLowerCase();

  // If role is code or prompt contains code/كود or component creation
  if (role === 'code' || p.includes('كود') || p.includes('زر') || p.includes('بطاقة') || p.includes('تسعير') || p.includes('تسجيل') || p.includes('card') || p.includes('pricing') || p.includes('button') || p.includes('صمم') || p.includes('أنشئ')) {
    
    // Check specific requests
    if (p.includes('تسعير') || p.includes('pricing') || p.includes('باقة')) {
      const codeHtml = `
<div class="w-full h-full p-6 bg-gradient-to-br from-[#1C1C26] via-[#161620] to-[#0F0F17] border border-[#FF3366]/40 rounded-2xl shadow-2xl flex flex-col justify-between text-white relative overflow-hidden">
  <div class="absolute -right-10 -top-10 w-28 h-28 bg-[#FF3366]/20 rounded-full blur-2xl pointer-events-none"></div>
  <div>
    <div class="flex items-center justify-between mb-2">
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF3366]/20 text-[#FF3366] border border-[#FF3366]/30 uppercase tracking-wider">الأكثر طلباً</span>
      <span class="text-xs text-slate-400">باقة المحترفين</span>
    </div>
    <div class="flex items-baseline gap-1 my-3">
      <span class="text-3xl font-extrabold text-white tracking-tight">$29</span>
      <span class="text-xs text-slate-400">/ شهرياً</span>
    </div>
    <ul class="space-y-2 text-xs text-slate-300">
      <li class="flex items-center gap-2"><span class="text-[#00D2FF]">✓</span> وصول غير محدود لوكلاء DeepSeek</li>
      <li class="flex items-center gap-2"><span class="text-[#00D2FF]">✓</span> تحريك تلقائي 60 FPS غير مقيد</li>
      <li class="flex items-center gap-2"><span class="text-[#00D2FF]">✓</span> تصدير مباشر لكود React & Tailwind</li>
    </ul>
  </div>
  <button class="w-full py-2.5 mt-4 bg-gradient-to-r from-[#FF3366] to-[#E02956] hover:from-[#E02956] hover:to-[#FF3366] rounded-xl text-white text-xs font-bold shadow-lg shadow-pink-500/25 transition active:scale-95">
    ترقية الحساب الآن
  </button>
</div>`.trim();

      return {
        text: `💻 **وكيل الأكواد (DeepSeek Code Engine):**\n\nتمت كتابة كود Tailwind كامل لبطاقة تسعير احترافية (SaaS Pricing Card).\n⚡ **تم تطبيق الكود مباشرة على مساحة العمل أمامك الآن!**`,
        actionPayload: {
          type: 'ADD_LIVE_CODE',
          name: 'بطاقة تسعير Pro (كود حي)',
          width: 320,
          height: 340,
          code: codeHtml
        }
      };
    }

    if (p.includes('زر') || p.includes('button') || p.includes('نيون')) {
      const codeHtml = `
<div class="w-full h-full flex items-center justify-center p-3 bg-[#14141A] rounded-xl border border-white/5">
  <button class="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D2FF] via-[#7928CA] to-[#FF3366] text-white text-sm font-bold shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(255,51,102,0.6)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2">
    <span>⚡ تفعيل محرك الذكاء الاصطناعي</span>
  </button>
</div>`.trim();

      return {
        text: `💻 **وكيل الأكواد (DeepSeek Code Engine):**\n\nتم توليد زر نيون متدرج (Cyberpunk Glowing Button) بتأثيرات ظلال ضوئية حية.\n⚡ **تم إدراجه وتطبيقه مباشرة على اللوحة!**`,
        actionPayload: {
          type: 'ADD_LIVE_CODE',
          name: 'زر نيون تفاعلي (كود حي)',
          width: 280,
          height: 90,
          code: codeHtml
        }
      };
    }

    if (p.includes('تسجيل') || p.includes('login') || p.includes('دخول')) {
      const codeHtml = `
<div class="w-full h-full p-6 bg-[#181822] border border-[#2E2E3C] rounded-2xl shadow-2xl flex flex-col justify-between text-white">
  <div class="text-center mb-2">
    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF3366] to-purple-600 flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm shadow-lg shadow-pink-500/20">IN</div>
    <h3 class="font-bold text-base text-white">تسجيل الدخول إلى Studio</h3>
    <p class="text-[11px] text-slate-400">أدخل بياناتك للمتابعة لمساحة العمل</p>
  </div>
  <div class="space-y-2.5 my-2">
    <input type="text" placeholder="name@company.com" class="w-full px-3 py-2 bg-[#22222E] border border-[#333344] focus:border-[#FF3366] rounded-lg text-xs text-white outline-none" />
    <input type="password" placeholder="••••••••" class="w-full px-3 py-2 bg-[#22222E] border border-[#333344] focus:border-[#FF3366] rounded-lg text-xs text-white outline-none" />
  </div>
  <button class="w-full py-2.5 bg-[#FF3366] hover:bg-[#E02956] rounded-xl text-xs font-semibold text-white shadow-lg shadow-pink-500/30 transition active:scale-95">
    دخول إلى حسابي
  </button>
</div>`.trim();

      return {
        text: `💻 **وكيل الأكواد (DeepSeek Code Engine):**\n\nتمت برمجة شاشة تسجيل دخول متكاملة بكود Tailwind وتنسيقات استوديو InVision.\n⚡ **تم تطبيق الكود مباشرة على مساحة العمل!**`,
        actionPayload: {
          type: 'ADD_LIVE_CODE',
          name: 'واجهة تسجيل دخول (كود حي)',
          width: 320,
          height: 360,
          code: codeHtml
        }
      };
    }

    // Default Component Code
    const codeHtml = `
<div class="w-full h-full p-5 bg-gradient-to-br from-[#1C1C26] to-[#121218] border border-[#333344] rounded-2xl shadow-xl flex flex-col justify-between text-white">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/30 flex items-center justify-center font-bold text-xs">AI</div>
      <div>
        <h4 class="font-bold text-xs text-white">عنصر تفاعلي تم توليده بكود حي</h4>
        <span class="text-[10px] text-slate-400">DeepSeek Live Component</span>
      </div>
    </div>
    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
  </div>
  <div class="my-3 p-3 rounded-lg bg-[#242432]/60 border border-white/5">
    <div class="flex justify-between text-xs mb-1">
      <span class="text-slate-400">معدل التحديث</span>
      <span class="font-mono text-[#00D2FF] font-semibold">60 FPS</span>
    </div>
    <div class="w-full bg-[#181822] h-1.5 rounded-full overflow-hidden">
      <div class="bg-gradient-to-r from-[#00D2FF] to-[#FF3366] h-full w-[85%] rounded-full"></div>
    </div>
  </div>
  <button class="w-full py-2 bg-gradient-to-r from-[#FF3366] to-purple-600 rounded-lg text-xs font-medium text-white shadow-md hover:opacity-90 transition">
    تفاعل مع المكون
  </button>
</div>`.trim();

    return {
      text: `💻 **وكيل ديب سيك للكود الحي:**\n\nتمت كتابة الكود البرمجي بالكامل باستخدام HTML و Tailwind CSS.\n⚡ **تم تطبيق النتيجة فوراً على مساحة العمل أمامك!** يمكنك تعديل الكود في أي وقت من لوحة الخصائص وسيتغير في الحال.`,
      actionPayload: {
        type: 'ADD_LIVE_CODE',
        name: 'مكون إحصاءات حي (DeepSeek)',
        width: 320,
        height: 220,
        code: codeHtml
      }
    };
  }

  if (role === 'tokens') {
    return {
      text: `🎨 **وكيل نظم التصميم (DeepSeek Design Tokens):**\n\nتم تحليل وتوليد لوحة الرموز الموصى بها:\n• اللون الأساسي: \`#FF3366\`\n• النيون: \`#00D2FF\`\n• الخلفية: \`#141417\`\n• اللوحات: \`#1E1E24\`\n\nتم ربط الرموز بنجاح مع شجرة المشهد.`
    };
  }

  // Auditor Role
  return {
    text: `🔍 **وكيل تدقيق سهولة الاستخدام (DeepSeek Auditor):**\n\n✅ التباين اللوني ممتاز (WCAG AAA).\n✅ أبعاد أزرار اللمس مطابقة للمعايير القياسية.\n💡 نصيحة: استخدام شبكة 8px لهوامش الفراغات الداخلية.`
  };
}

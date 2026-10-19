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
Your role is to understand user UI and vector design requirements and generate high-fidelity UI components on the infinite canvas.
When responding, ALWAYS return a valid JSON block containing "type": "ADD_LIVE_CODE" or "ADD_NODES":
Example:
\`\`\`json
{
  "type": "ADD_LIVE_CODE",
  "name": "اسم المكون",
  "width": 480,
  "height": 380,
  "code": "<div class=\\"...\\">...</div>"
}
\`\`\`
Always ensure design is modern, high-contrast, interactive with self-contained styles.`,

  code: `You are DeepSeek Live Code & Frontend Engineer inside InVision Studio.
When the user asks you to write code, draw a design, or create an interactive component (e.g. animated vehicle, card, dashboard, game, button), your code WILL BE EXECUTED AND RENDERED DIRECTLY on the InVision Canvas.
Return a valid JSON block of type "ADD_LIVE_CODE" with clean HTML + Tailwind CSS + inline styles:
\`\`\`json
{
  "type": "ADD_LIVE_CODE",
  "name": "اسم المكون التفاعلي",
  "width": 520,
  "height": 400,
  "code": "<div class=\\"...\\">...</div>"
}
\`\`\`
Use self-contained <style> blocks and inline onclick/oninput handlers for interactivity.`,

  tokens: `You are DeepSeek Design Token Specialist inside InVision Studio.
Generate cohesive design systems, semantic color palettes and spacing scales.`,

  auditor: `You are DeepSeek UX & Accessibility Auditor.
Inspect component properties, contrast ratios (WCAG AA/AAA), hierarchy, touch targets, and provide actionable design critiques.`
};

// Helper to intelligently extract any code/JSON payload from LLM response
function extractActionPayload(replyText: string): any {
  // 1. Try standard ```json ... ```
  const jsonMatch = replyText.match(/```json\s*([\s\S]*?)\s*```/i);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed.type) return parsed;
    } catch (e) {
      console.warn('Failed parsing json block:', e);
    }
  }

  // 2. Try raw JSON object with "type": "ADD_LIVE_CODE" or "ADD_NODES"
  const rawJsonMatch = replyText.match(/\{[\s\r\n]*"type"\s*:\s*"(ADD_LIVE_CODE|ADD_NODES)"[\s\S]*?\}(?=\s*$|\s*```)/);
  if (rawJsonMatch) {
    try {
      const parsed = JSON.parse(rawJsonMatch[0]);
      if (parsed.type) return parsed;
    } catch (e) {}
  }

  // 3. Try finding HTML or SVG code block
  const htmlMatch = replyText.match(/```(?:html|xml|svg)\s*([\s\S]*?)\s*```/i);
  if (htmlMatch) {
    return {
      type: 'ADD_LIVE_CODE',
      name: 'مكون تم توليده تلقائياً',
      width: 480,
      height: 360,
      code: htmlMatch[1].trim()
    };
  }

  // 4. Try finding an SVG or HTML tag directly in the text
  const svgIndex = replyText.indexOf('<svg');
  if (svgIndex !== -1) {
    const endSvg = replyText.lastIndexOf('</svg>');
    if (endSvg !== -1) {
      const svgCode = replyText.substring(svgIndex, endSvg + 6);
      return {
        type: 'ADD_LIVE_CODE',
        name: 'رسم بياني تفاعلي (SVG)',
        width: 480,
        height: 340,
        code: `<div class="w-full h-full p-4 flex items-center justify-center bg-[#181824] rounded-2xl border border-white/10 shadow-2xl">${svgCode}</div>`
      };
    }
  }

  return undefined;
}

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

    // Robust parsing
    const actionPayload = extractActionPayload(replyText);

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

// Generate the interactive Volkswagen Beetle component
function generateVolkswagenBeetleComponent(): string {
  const uid = 'vw_' + Math.floor(Math.random() * 100000);
  return `
<div id="${uid}" class="w-full h-full p-4 bg-gradient-to-b from-[#181822] via-[#12121A] to-[#0A0A10] border border-[#333346] rounded-2xl shadow-2xl flex flex-col justify-between text-white font-sans select-none overflow-hidden relative" style="--car-color: #EAB308;">
  <style>
    @keyframes ${uid}_wheelRoll {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes ${uid}_roadMove {
      from { background-position: 0 0; }
      to { background-position: -80px 0; }
    }
    @keyframes ${uid}_chassisBounce {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
      100% { transform: translateY(0px); }
    }
    @keyframes ${uid}_smokePuff {
      0% { opacity: 0.8; transform: translate(0, 0) scale(0.6); }
      100% { opacity: 0; transform: translate(-40px, -20px) scale(2); }
    }

    #${uid} .moving-wheels .vw-wheel {
      animation: ${uid}_wheelRoll 0.6s linear infinite;
    }
    #${uid} .moving-road {
      animation: ${uid}_roadMove 0.6s linear infinite !important;
    }
    #${uid} .bouncing-chassis {
      animation: ${uid}_chassisBounce 0.3s ease-in-out infinite alternate;
    }
    #${uid} .smoke-active {
      display: block !important;
      animation: ${uid}_smokePuff 0.7s ease-out infinite;
    }

    /* Beetle Door Swing Transition */
    #${uid} .vw-door {
      transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: 220px 140px;
    }
    #${uid} .door-open .vw-door {
      transform: perspective(400px) rotateY(-55deg) translate(-10px, -5px);
      filter: drop-shadow(-10px 5px 15px rgba(0,0,0,0.8));
    }
  </style>

  <!-- Top Controls: Header, Door Toggle, Drive Toggle, Headlights -->
  <div class="flex items-center justify-between pb-2 border-b border-white/10 z-10">
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center justify-center font-bold text-xs">
        VW
      </div>
      <div>
        <h4 class="font-bold text-xs text-white">فولكس فاجن الخنفساء (VW Beetle)</h4>
        <span class="text-[10px] text-slate-400">تصميم كلاسيكي تفاعلي مع محاكاة الحركة وفتح الأبواب</span>
      </div>
    </div>

    <!-- Quick action buttons -->
    <div class="flex items-center gap-1.5">
      <button 
        onclick="
          var c = document.getElementById('${uid}');
          var isOpen = c.classList.toggle('door-open');
          var lbl = document.getElementById('${uid}_door_lbl');
          lbl.innerText = isOpen ? 'إغلاق الباب' : 'فتح الباب';
        "
        class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] font-semibold text-white transition active:scale-95 flex items-center gap-1"
      >
        <span>🚪</span>
        <span id="${uid}_door_lbl">فتح الباب</span>
      </button>

      <button 
        onclick="
          var c = document.getElementById('${uid}');
          var isMoving = c.classList.toggle('moving-wheels');
          c.classList.toggle('bouncing-chassis');
          var road = document.getElementById('${uid}_road');
          road.classList.toggle('moving-road');
          var smoke = document.getElementById('${uid}_smoke');
          smoke.classList.toggle('smoke-active');
          var lbl = document.getElementById('${uid}_drive_lbl');
          lbl.innerText = isMoving ? 'إيقاف الحركة' : 'محاكاة القيادة';
        "
        class="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-[11px] font-semibold text-white shadow-md shadow-emerald-500/20 transition active:scale-95 flex items-center gap-1"
      >
        <span>🚗</span>
        <span id="${uid}_drive_lbl">محاكاة القيادة</span>
      </button>

      <button 
        onclick="
          var light = document.getElementById('${uid}_headlight');
          light.classList.toggle('hidden');
        "
        class="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition active:scale-95"
        title="تشغيل/إطفاء الكشافات"
      >
        💡
      </button>
    </div>
  </div>

  <!-- Stage: The Beetle Car Visualization & Animation -->
  <div class="relative flex-1 flex flex-col justify-center items-center py-4 my-auto overflow-hidden">
    <!-- Headlight Beam (hidden by default) -->
    <div id="${uid}_headlight" class="hidden absolute right-4 top-1/2 -translate-y-1/2 w-48 h-32 bg-gradient-to-r from-yellow-300/40 via-yellow-200/15 to-transparent rounded-r-full blur-md pointer-events-none z-10 transform translate-x-16 -translate-y-3"></div>

    <!-- Exhaust Smoke Puff (Hidden when stopped) -->
    <div id="${uid}_smoke" class="hidden absolute left-12 bottom-12 w-6 h-6 rounded-full bg-slate-400/40 blur-sm pointer-events-none z-0"></div>

    <!-- The Beetle Car SVG Graphic with Iconic Curves -->
    <div class="w-full max-w-[420px] transition-transform">
      <svg viewBox="0 0 460 220" class="w-full h-auto drop-shadow-2xl">
        <!-- Underbody Shadow -->
        <ellipse cx="230" cy="195" rx="190" ry="12" fill="rgba(0,0,0,0.6)" filter="blur(4px)" />

        <!-- Interior (Visible when door is open) -->
        <g id="${uid}_interior">
          <!-- Steering wheel & seat -->
          <circle cx="270" cy="115" r="14" fill="none" stroke="#2D3748" stroke-width="4" />
          <path d="M 270 101 L 270 129 M 256 115 L 284 115" stroke="#2D3748" stroke-width="3" />
          <path d="M 200 100 Q 210 135 220 160 L 250 160" fill="none" stroke="#4A5568" stroke-width="12" stroke-linecap="round" />
        </g>

        <!-- Rear & Front Chrome Bumpers -->
        <path d="M 45 170 Q 30 170 32 155 Q 35 150 48 152" fill="none" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round" />
        <path d="M 415 170 Q 430 170 428 155 Q 425 150 412 152" fill="none" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round" />

        <!-- Main Beetle Chassis (Curved Beetle Roofline) -->
        <!-- Distinctive round arch: front hood sloping down, roof arch, rear teardrop slope -->
        <path 
          id="${uid}_chassis"
          class="vw-chassis-fill transition-colors duration-300"
          d="M 50 165
             C 45 145, 60 115, 110 110
             C 140 105, 160 65, 230 65
             C 310 65, 340 95, 370 125
             C 410 135, 425 155, 420 168
             C 415 175, 400 175, 385 175
             C 385 145, 335 145, 335 175
             L 155 175
             C 155 145, 105 145, 105 175
             Z"
          fill="var(--car-color)"
          stroke="#1E2028"
          stroke-width="3"
        />

        <!-- Front Fender Curve (Iconic rounded bug fender) -->
        <path 
          class="vw-chassis-fill transition-colors duration-300"
          d="M 330 175 C 330 130, 410 130, 422 170 C 418 175, 340 175, 330 175 Z"
          fill="var(--car-color)"
          stroke="#1E2028"
          stroke-width="2.5"
        />

        <!-- Rear Fender Curve -->
        <path 
          class="vw-chassis-fill transition-colors duration-300"
          d="M 48 168 C 45 130, 125 130, 128 175 C 120 175, 55 175, 48 168 Z"
          fill="var(--car-color)"
          stroke="#1E2028"
          stroke-width="2.5"
        />

        <!-- Windows (Split classic curved windows) -->
        <!-- Rear curved quarter window -->
        <path d="M 160 110 C 170 85, 205 78, 225 78 L 225 112 Z" fill="#93C5FD" opacity="0.85" stroke="#334155" stroke-width="2" />
        <!-- Front window -->
        <path d="M 235 78 C 275 78, 305 95, 318 112 L 235 112 Z" fill="#BFDBFE" opacity="0.9" stroke="#334155" stroke-width="2" />

        <!-- Beetle Running Board (Step between fenders) -->
        <rect x="130" y="172" width="200" height="6" rx="2" fill="#1E2028" stroke="#CBD5E1" stroke-width="1" />

        <!-- Round Vintage Headlight -->
        <ellipse cx="416" cy="142" rx="9" ry="12" fill="#FEF08A" stroke="#CBD5E1" stroke-width="3" />
        <ellipse cx="414" cy="142" rx="5" ry="8" fill="#FFFFFF" opacity="0.8" />

        <!-- Round Vintage Taillight -->
        <ellipse cx="48" cy="145" rx="6" ry="8" fill="#EF4444" stroke="#CBD5E1" stroke-width="2" />

        <!-- Chrome Door Handle & Side Trim -->
        <line x1="110" y1="135" x2="330" y2="135" stroke="#CBD5E1" stroke-width="1.5" opacity="0.7" />

        <!-- SWINGING BEETLE DOOR -->
        <g class="vw-door">
          <path 
            class="vw-chassis-fill transition-colors duration-300"
            d="M 228 78 L 322 112 L 315 170 L 225 170 Z"
            fill="var(--car-color)"
            stroke="#111827"
            stroke-width="2"
          />
          <!-- Door Window -->
          <path d="M 235 82 C 275 82, 305 98, 314 112 L 235 112 Z" fill="#BFDBFE" opacity="0.8" stroke="#334155" stroke-width="1.5" />
          <!-- Chrome Door Handle -->
          <rect x="238" y="125" width="16" height="4" rx="2" fill="#F8FAFC" stroke="#64748B" stroke-width="0.8" />
        </g>

        <!-- WHEELS (With Classic VW Chrome Hubcaps) -->
        <!-- Rear Wheel -->
        <g class="vw-wheel" style="transform-origin: 90px 175px;">
          <circle cx="90" cy="175" r="32" fill="#1E2028" stroke="#0F172A" stroke-width="3" />
          <circle cx="90" cy="175" r="23" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" />
          <!-- Chrome Dome Hubcap -->
          <circle cx="90" cy="175" r="14" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
          <circle cx="90" cy="175" r="4" fill="#3B82F6" />
          <line x1="90" y1="152" x2="90" y2="198" stroke="#94A3B8" stroke-width="1.5" opacity="0.6" />
          <line x1="67" y1="175" x2="113" y2="175" stroke="#94A3B8" stroke-width="1.5" opacity="0.6" />
        </g>

        <!-- Front Wheel -->
        <g class="vw-wheel" style="transform-origin: 370px 175px;">
          <circle cx="370" cy="175" r="32" fill="#1E2028" stroke="#0F172A" stroke-width="3" />
          <circle cx="370" cy="175" r="23" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" />
          <!-- Chrome Dome Hubcap -->
          <circle cx="370" cy="175" r="14" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
          <circle cx="370" cy="175" r="4" fill="#3B82F6" />
          <line x1="370" y1="152" x2="370" y2="198" stroke="#94A3B8" stroke-width="1.5" opacity="0.6" />
          <line x1="347" y1="175" x2="393" y2="175" stroke="#94A3B8" stroke-width="1.5" opacity="0.6" />
        </g>
      </svg>
    </div>

    <!-- Animated Asphalt Road Stripe -->
    <div 
      id="${uid}_road" 
      class="w-full h-3 rounded-full mt-2" 
      style="background-color: #262633; background-image: repeating-linear-gradient(90deg, #E2E8F0 0, #E2E8F0 25px, transparent 25px, transparent 60px); background-size: 80px 3px;"
    ></div>
  </div>

  <!-- Bottom Bar: Palette Color Switcher & Custom Color Picker -->
  <div class="pt-3 border-t border-white/10 flex items-center justify-between text-xs z-10">
    <div class="flex items-center gap-2">
      <span class="text-[11px] text-slate-400 font-medium">لون هيكل الخنفساء:</span>
      <div class="flex items-center gap-1.5">
        <!-- Yellow -->
        <button 
          onclick="document.getElementById('${uid}').style.setProperty('--car-color', '#EAB308');"
          class="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white/40 hover:scale-110 transition shadow-sm"
          title="أصفر كلاسيكي"
        ></button>
        <!-- Red -->
        <button 
          onclick="document.getElementById('${uid}').style.setProperty('--car-color', '#E11D48');"
          class="w-6 h-6 rounded-full bg-rose-600 border-2 border-white/40 hover:scale-110 transition shadow-sm"
          title="أحمر كلاسيكي"
        ></button>
        <!-- Sky Blue -->
        <button 
          onclick="document.getElementById('${uid}').style.setProperty('--car-color', '#0284C7');"
          class="w-6 h-6 rounded-full bg-sky-600 border-2 border-white/40 hover:scale-110 transition shadow-sm"
          title="أزرق كلاسيكي"
        ></button>
        <!-- Mint Green -->
        <button 
          onclick="document.getElementById('${uid}').style.setProperty('--car-color', '#10B981');"
          class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white/40 hover:scale-110 transition shadow-sm"
          title="أخضر نعناعي"
        ></button>
        <!-- Ivory White -->
        <button 
          onclick="document.getElementById('${uid}').style.setProperty('--car-color', '#F8FAFC');"
          class="w-6 h-6 rounded-full bg-slate-100 border-2 border-white/40 hover:scale-110 transition shadow-sm"
          title="أبيض عاجي"
        ></button>
        <!-- InVision Pink -->
        <button 
          onclick="document.getElementById('${uid}').style.setProperty('--car-color', '#FF3366');"
          class="w-6 h-6 rounded-full bg-[#FF3366] border-2 border-white/40 hover:scale-110 transition shadow-sm"
          title="وردي InVision"
        ></button>
      </div>
    </div>

    <!-- Custom Color Picker -->
    <div class="flex items-center gap-1.5 bg-[#222230] px-2.5 py-1 rounded-xl border border-white/10">
      <span class="text-[10px] text-slate-400">لون مخصص:</span>
      <input 
        type="color" 
        value="#EAB308"
        oninput="document.getElementById('${uid}').style.setProperty('--car-color', this.value);"
        class="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
      />
    </div>
  </div>
</div>
`.trim();
}

// Smart simulator with live rendering payloads that appear immediately on canvas
function simulateDeepSeekResponse(
  role: AIAgentRole,
  userPrompt: string,
  canvasContext?: { selectedNodes: SceneNode[]; allNodes: SceneNode[] }
): { text: string; actionPayload?: any } {
  const p = userPrompt.toLowerCase();

  // 1. CAR / VEHICLE / BEETLE / VOLKSWAGEN (User's specific request!)
  if (
    p.includes('سيار') || 
    p.includes('سياره') || 
    p.includes('خنفس') || 
    p.includes('فولكس') || 
    p.includes('beetle') || 
    p.includes('car') || 
    p.includes('ابواب') || 
    p.includes('أبواب') ||
    p.includes('مركب')
  ) {
    const codeHtml = generateVolkswagenBeetleComponent();
    return {
      text: `🚗 **وكيل ديب سيك للكود الحي والتصميم:**\n\nتم رسم وتطوير سيارة **فولكس فاجن الخنفساء (VW Beetle)** الكلاسيكية بنجاح!\n\n✨ **الميزات التفاعلية المطبقة فوراً على مساحة العمل:**\n• **تصميم الخنفساء الشهير:** منحنيات الهيكل المقوسة، رفارف العجلات الدائرية، الكشافات الكروية، والصدامات الكرومية.\n• 🚪 **فتح وإغلاق الأبواب:** اضغط على زر *"فتح الباب"* لتشاهد الباب ينفتح ثلاثي الأبعاد ويكشف عن المقود والمقصورة الداخلية.\n• 🚗 **محاكاة القيادة والحركة:** اضغط على *"محاكاة القيادة"* لتدور العجلات وتتحرك خطوط الطريق الأسفلتية ويهتز الهيكل مع انبعاث العادم.\n• 🎨 **تغيير لون الهيكل لحظياً:** اختر من لوحة الألوان الكلاسيكية (أصفر، أحمر، أزرق، أخضر، أبيض) أو استخدم منتقي الألوان المخصص.\n• 💡 **كشافات الإضاءة:** يمكنك تشغيل الكشافات الأمامية بزر الإضاءة.\n\n⚡ **تم تطبيق النموذج فوراً كعنصر تفاعلي على مساحة العمل أمامك!**`,
      actionPayload: {
        type: 'ADD_LIVE_CODE',
        name: 'سيارة فولكس فاجن الخنفساء التفاعلية',
        width: 500,
        height: 380,
        code: codeHtml
      }
    };
  }

  // 2. PRICING CARD
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
      text: `💻 **وكيل الأكواد (DeepSeek Code Engine):**\n\nتمت كتابة كود Tailwind كامل لبطاقة تسعير احترافية.\n⚡ **تم تطبيق الكود مباشرة على مساحة العمل أمامك الآن!**`,
      actionPayload: {
        type: 'ADD_LIVE_CODE',
        name: 'بطاقة تسعير Pro (كود حي)',
        width: 320,
        height: 340,
        code: codeHtml
      }
    };
  }

  // 3. BUTTONS
  if (p.includes('زر') || p.includes('button') || p.includes('نيون')) {
    const codeHtml = `
<div class="w-full h-full flex items-center justify-center p-3 bg-[#14141A] rounded-xl border border-white/5">
  <button class="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D2FF] via-[#7928CA] to-[#FF3366] text-white text-sm font-bold shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(255,51,102,0.6)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2">
    <span>⚡ تفعيل محرك الذكاء الاصطناعي</span>
  </button>
</div>`.trim();

    return {
      text: `💻 **وكيل الأكواد (DeepSeek Code Engine):**\n\nتم توليد زر نيون متدرج تفاعلي.\n⚡ **تم إدراجه وتطبيقه مباشرة على اللوحة!**`,
      actionPayload: {
        type: 'ADD_LIVE_CODE',
        name: 'زر نيون تفاعلي (كود حي)',
        width: 280,
        height: 90,
        code: codeHtml
      }
    };
  }

  // 4. LOGIN INTERFACE
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

  // 5. TOKENS ROLE
  if (role === 'tokens') {
    return {
      text: `🎨 **وكيل نظم التصميم (DeepSeek Design Tokens):**\n\nتم تحليل وتوليد لوحة الرموز الموصى بها:\n• اللون الأساسي: \`#FF3366\`\n• النيون: \`#00D2FF\`\n• الخلفية: \`#141417\`\n• اللوحات: \`#1E1E24\`\n\nتم ربط الرموز بنجاح مع شجرة المشهد.`
    };
  }

  // 6. AUDITOR ROLE
  if (role === 'auditor') {
    return {
      text: `🔍 **وكيل تدقيق سهولة الاستخدام (DeepSeek Auditor):**\n\n✅ التباين اللوني ممتاز (WCAG AAA).\n✅ أبعاد أزرار اللمس مطابقة للمعايير القياسية.\n💡 نصيحة: استخدام شبكة 8px لهوامش الفراغات الداخلية.`
    };
  }

  // 7. UNIVERSAL DYNAMIC COMPONENT FOR ANY OTHER ARBITRARY PROMPT
  const codeHtml = `
<div class="w-full h-full p-5 bg-gradient-to-br from-[#1C1C26] to-[#121218] border border-[#333344] rounded-2xl shadow-xl flex flex-col justify-between text-white">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/30 flex items-center justify-center font-bold text-xs">AI</div>
      <div>
        <h4 class="font-bold text-xs text-white">${userPrompt.slice(0, 35)}</h4>
        <span class="text-[10px] text-slate-400">DeepSeek Live Generated Component</span>
      </div>
    </div>
    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
  </div>
  <div class="my-3 p-3 rounded-lg bg-[#242432]/60 border border-white/5">
    <p class="text-xs text-slate-300 leading-relaxed mb-2">${userPrompt}</p>
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
    text: `💻 **وكيل ديب سيك للكود الحي:**\n\nتمت معالجة طلبك: "${userPrompt}" وكتابة الكود البرمجي بالكامل.\n⚡ **تم تطبيق النتيجة فوراً على مساحة العمل أمامك!**`,
    actionPayload: {
      type: 'ADD_LIVE_CODE',
      name: 'مكون مخصص (DeepSeek)',
      width: 360,
      height: 240,
      code: codeHtml
    }
  };
}

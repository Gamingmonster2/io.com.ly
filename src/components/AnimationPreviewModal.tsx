import React, { useState } from 'react';
import { 
  X, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  ArrowRightLeft 
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const AnimationPreviewModal: React.FC = () => {
  const { previewAnimation, setPreviewAnimation } = useStudio();
  const [isStateB, setIsStateB] = useState(false);
  const [duration, setDuration] = useState(400); // ms
  const [easing, setEasing] = useState('cubic-bezier(0.4, 0.0, 0.2, 1)');

  if (!previewAnimation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-studio-panel border border-studio-border rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-studio-border flex items-center justify-between bg-studio-subpanel/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-studio-accent/20 border border-studio-accent/40 flex items-center justify-center text-studio-accent">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">محاكي Auto-Animate — انتقال الشاشات التلقائي</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  60 FPS Hardware Accelerated
                </span>
              </div>
              <p className="text-[11px] text-studio-muted">
                مطابقة المعرفات المستقرة واشتقاق فروق الموضع والحجم تلقائياً وفق معادلة Cubic Bezier
              </p>
            </div>
          </div>

          <button
            onClick={() => setPreviewAnimation(false)}
            className="p-1.5 rounded-lg hover:bg-studio-hover text-studio-muted hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Animation Canvas Stage */}
        <div className="flex-1 min-h-[460px] bg-studio-bg flex items-center justify-center p-8 relative overflow-hidden">
          {/* Subtle grid in modal */}
          <div className="absolute inset-0 canvas-grid opacity-40 pointer-events-none" />

          {/* Simulated Screen Device Frame */}
          <div className="w-[380px] h-[480px] bg-[#181820] border border-studio-border rounded-2xl shadow-2xl p-6 relative flex flex-col justify-between overflow-hidden">
            {/* Top Header Transition */}
            <div className="text-center space-y-2">
              <h4 
                className="font-bold transition-all"
                style={{
                  transition: `all ${duration}ms ${easing}`,
                  fontSize: isStateB ? '22px' : '20px',
                  color: isStateB ? '#00D2FF' : '#ECECF1'
                }}
              >
                {isStateB ? 'تم تفعيل وكيل ديب سيك!' : 'شاشة التحريك التفاعلي'}
              </h4>
              <p 
                className="text-xs transition-all leading-relaxed"
                style={{
                  transition: `all ${duration}ms ${easing}`,
                  color: isStateB ? '#FFFFFF' : '#8E8EA0'
                }}
              >
                {isStateB 
                  ? 'تم اشتقاق التحول اللحظي بسلاسة تامة دون وميض الشاشة.' 
                  : 'انقر على الزر بالأسفل لاختبار التحول الآلي بين الحالتين.'
                }
              </p>
            </div>

            {/* Center Animated Element / Card */}
            <div className="flex items-center justify-center my-auto">
              <div
                className="border flex flex-col items-center justify-center p-4 text-center transition-all"
                style={{
                  transition: `all ${duration}ms ${easing}`,
                  width: isStateB ? '300px' : '260px',
                  height: isStateB ? '160px' : '120px',
                  backgroundColor: isStateB ? '#1E1E28' : '#22222B',
                  borderColor: isStateB ? '#00D2FF' : '#33333E',
                  borderRadius: isStateB ? '20px' : '12px',
                  boxShadow: isStateB ? '0 15px 35px rgba(0, 210, 255, 0.2)' : 'none'
                }}
              >
                {isStateB ? (
                  <div className="space-y-1 animate-fade-in">
                    <CheckCircle2 className="w-8 h-8 text-cyan-400 mx-auto mb-1 animate-bounce" />
                    <span className="font-semibold text-white text-xs block">اكتمال العملية بنجاح</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Transition Key: btn_submit matched</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Activity className="w-6 h-6 text-studio-muted mx-auto mb-1" />
                    <span className="text-xs text-studio-muted block">الحالة الابتدائية (State A)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Button: The Hero Transition Element (btn_submit) */}
            <div className="flex justify-center">
              <button
                onClick={() => setIsStateB(!isStateB)}
                className="flex items-center justify-center text-white font-semibold transition-all shadow-lg active:scale-95"
                style={{
                  transition: `all ${duration}ms ${easing}`,
                  width: isStateB ? '320px' : '160px',
                  height: '50px',
                  backgroundColor: isStateB ? '#00D2FF' : '#FF3366',
                  color: isStateB ? '#0A0A10' : '#FFFFFF',
                  borderRadius: isStateB ? '14px' : '10px',
                  opacity: isStateB ? 1.0 : 0.85,
                  boxShadow: isStateB ? '0 8px 25px rgba(0, 210, 255, 0.4)' : '0 8px 25px rgba(255, 51, 102, 0.3)'
                }}
              >
                {isStateB ? '✓ معتمد من ديب سيك' : 'انتقال Auto-Animate'}
              </button>
            </div>
          </div>
        </div>

        {/* Control bar */}
        <div className="p-4 border-t border-studio-border bg-studio-subpanel/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStateB(!isStateB)}
              className="px-4 py-2 rounded-lg bg-studio-accent hover:bg-studio-accentHover text-white font-medium flex items-center gap-2 shadow-md transition active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>تبديل الحالة ({isStateB ? 'الحالة B' : 'الحالة A'})</span>
            </button>

            <button
              onClick={() => setIsStateB(false)}
              className="p-2 rounded-lg bg-studio-panel hover:bg-studio-hover border border-studio-border text-studio-muted hover:text-white transition"
              title="إعادة ضبط للحالة A"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-studio-muted">
            {/* Duration slider */}
            <div className="flex items-center gap-2">
              <span className="text-[11px]">المدة الزمنية:</span>
              <input
                type="range"
                min="150"
                max="1000"
                step="50"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-24 accent-studio-accent cursor-pointer"
              />
              <span className="font-mono text-white text-[11px] w-12">{duration}ms</span>
            </div>

            {/* Easing curve */}
            <div className="flex items-center gap-2">
              <span className="text-[11px]">منحنى الاستيفاء:</span>
              <select
                value={easing}
                onChange={(e) => setEasing(e.target.value)}
                className="bg-studio-panel border border-studio-border text-white text-[11px] rounded-lg px-2 py-1 outline-none font-mono"
              >
                <option value="cubic-bezier(0.4, 0.0, 0.2, 1)">Cubic-Bezier (InVision Default)</option>
                <option value="ease-in-out">Ease In-Out</option>
                <option value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">Spring / Bounce</option>
                <option value="linear">Linear</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

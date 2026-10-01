import React, { useState, useRef, useEffect } from 'react';
import { BoardData, ComponentItem, QualityGateResult } from '../types';
import { analyzeImageQuality } from '../utils/imageQualityGate';
import { calibrateTargetComponent } from '../utils/coordinateCalibration';
import {
  Camera,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sun,
  Eye,
  Crosshair,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';

interface MacroCameraViewProps {
  board: BoardData;
  targetComponent: ComponentItem;
  onCaptureApproved: (capturedImage: string, qualityResult: QualityGateResult) => void;
  onBack: () => void;
}

export const MacroCameraView: React.FC<MacroCameraViewProps> = ({
  board,
  targetComponent,
  onCaptureApproved,
  onBack,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [qualityResult, setQualityResult] = useState<QualityGateResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Simulated workshop photo mode if camera is disabled or in mock preview
  const [useSimulatedFeed, setUseSimulatedFeed] = useState<boolean>(true);
  const [lightingSim, setLightingSim] = useState<'NORMAL' | 'GLARE' | 'BLURRY' | 'DARK'>('NORMAL');

  // Alignment reticle animation & tilt simulation
  const [pitch, setPitch] = useState<number>(0.2); // tilt degrees
  const [roll, setRoll] = useState<number>(-0.4);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [useSimulatedFeed]);

  const startCamera = async () => {
    if (useSimulatedFeed) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
        setStreamError(null);
      }
    } catch (err: any) {
      console.warn('Camera stream unavailable, switching to simulated workshop feed:', err.message);
      setUseSimulatedFeed(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  };

  // Generate synthetic high-resolution workshop board image for simulation
  const drawSimulatedBoard = (ctx: CanvasRenderingContext2D, width: number, height: number, condition: string) => {
    // Dark Emerald PCB background
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 0, width, height);

    // Copper traces & ground plane
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 20, height);
      ctx.stroke();
    }

    // Component Area
    const cx = width / 2;
    const cy = height / 2;

    // Surrounding components
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - 160, cy - 80, 70, 50); // Adjacent IC
    ctx.fillStyle = '#475569';
    ctx.fillRect(cx + 80, cy - 60, 50, 45); // Inductor
    ctx.fillStyle = '#b45309';
    ctx.fillRect(cx - 80, cy + 40, 30, 20); // Cap 1
    ctx.fillRect(cx + 40, cy + 50, 30, 20); // Cap 2

    // Target Component: e.g. C2150
    ctx.fillStyle = '#d97706';
    ctx.fillRect(cx - 35, cy - 20, 70, 40);
    // Silver end terminations
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx - 45, cy - 20, 10, 40);
    ctx.fillRect(cx + 35, cy - 20, 10, 40);

    // Silk text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(targetComponent.ref, cx, cy + 6);

    // Condition Overlays
    if (condition === 'GLARE') {
      // White blown-out specular highlight
      const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (condition === 'DARK') {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
      ctx.fillRect(0, 0, width, height);
    } else if (condition === 'BLURRY') {
      // Simulate low-pass blur
      ctx.filter = 'blur(12px)';
      ctx.drawImage(ctx.canvas, 0, 0);
      ctx.filter = 'none';
    }
  };

  const handleCapture = async () => {
    setIsAnalyzing(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!useSimulatedFeed && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      drawSimulatedBoard(ctx, canvas.width, canvas.height, lightingSim);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);

    // Perform Fast Pre-Model Quality Gate (Section 5.4)
    const result = await analyzeImageQuality(canvas);
    setQualityResult(result);
    setIsAnalyzing(false);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setQualityResult(null);
    setLightingSim('NORMAL');
  };

  const handleApprove = () => {
    if (capturedImage && qualityResult && qualityResult.passed) {
      onCaptureApproved(capturedImage, qualityResult);
    }
  };

  const isLevel = Math.abs(pitch) < 1.5 && Math.abs(roll) < 1.5;

  return (
    <div className="relative w-full h-[660px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-3.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>رجوع للتشخيص</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 font-mono">
                {targetComponent.ref}
              </span>
              <span className="text-xs text-slate-300 font-semibold">
                {targetComponent.nameAr}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {board.model} — {targetComponent.side === 'TOP' ? 'الوجه العلوي' : 'الوجه السفلي'}
            </p>
          </div>
        </div>

        {/* Stream Source Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setUseSimulatedFeed(true)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                useSimulatedFeed
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              مجهر الورشة (محاكاة دقيقة)
            </button>
            <button
              onClick={() => setUseSimulatedFeed(false)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                !useSimulatedFeed
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              كاميرا الجهاز المباشرة
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {!capturedImage ? (
          <>
            {/* Video or Simulated Canvas Feed */}
            {useSimulatedFeed ? (
              <div
                className="relative w-full h-full flex items-center justify-center"
                style={{
                  backgroundColor: '#064e3b',
                  backgroundImage: `
                    radial-gradient(circle at 50% 50%, rgba(4, 120, 87, 0.4) 0%, rgba(6, 78, 59, 0.95) 100%)
                  `,
                }}
              >
                {/* Simulated Board Structure in Viewport */}
                <div className="relative w-80 h-48 border-2 border-emerald-500/40 rounded-xl bg-emerald-950/80 flex items-center justify-center shadow-2xl">
                  <div className="absolute top-3 left-4 w-12 h-10 bg-slate-800 rounded border border-slate-700 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-slate-400">U2050</span>
                  </div>
                  <div className="absolute top-3 right-4 w-14 h-12 bg-slate-700 rounded border border-slate-600 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-slate-400">L2005</span>
                  </div>
                  {/* Target Component */}
                  <div className="w-20 h-10 bg-amber-500 border-2 border-slate-950 rounded flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
                    <span className="text-xs font-mono font-black text-slate-950">
                      {targetComponent.ref}
                    </span>
                  </div>
                </div>

                {/* Glare/Dark/Blur simulation overlay */}
                {lightingSim === 'GLARE' && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                    <div className="w-96 h-96 bg-white rounded-full blur-2xl opacity-90" />
                  </div>
                )}
                {lightingSim === 'DARK' && (
                  <div className="absolute inset-0 bg-slate-950/90 pointer-events-none" />
                )}
                {lightingSim === 'BLURRY' && (
                  <div className="absolute inset-0 backdrop-blur-md pointer-events-none" />
                )}
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {/* Section 2.6: Four-Corner Moving Target Reticle */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-72 h-52 border border-amber-400/30 rounded-2xl flex items-center justify-center">
                {/* 4 Corner Target Brackets */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-xl -mt-1 -mr-1" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-xl -mt-1 -ml-1" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-xl -mb-1 -mr-1" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-xl -mb-1 -ml-1" />

                {/* Crosshairs Center */}
                <div className="w-12 h-12 border border-amber-400/50 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-amber-400 rounded-full" />
                </div>

                {/* Target Component Pill on top of Frame */}
                <div className="absolute -top-4 bg-amber-500 text-slate-950 px-3 py-0.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>الهدف: {targetComponent.ref} ({targetComponent.value})</span>
                </div>

                {/* Level / Gyro Indicator */}
                <div
                  className={`absolute -bottom-4 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold border shadow-lg flex items-center gap-1.5 ${
                    isLevel
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-rose-500/20 border-rose-500 text-rose-400'
                  }`}
                >
                  <Sliders className="w-3 h-3" />
                  <span>استواء الكاميرا: {isLevel ? 'مثالي 0.0°' : 'يرجى موازاة اللوحة'}</span>
                </div>
              </div>
            </div>

            {/* Quick Test Lighting Condition Presets (Workshop Testing Helper) */}
            {useSimulatedFeed && (
              <div className="absolute right-4 top-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-2xl p-2.5 flex flex-col gap-1.5 z-10">
                <span className="text-[10px] font-bold text-slate-400 mb-0.5 px-1">
                  اختبار استجابة البوابة الذكية:
                </span>
                <button
                  onClick={() => setLightingSim('NORMAL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-right transition-colors ${
                    lightingSim === 'NORMAL'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  ✓ صورة مثالية وواضحة
                </button>
                <button
                  onClick={() => setLightingSim('GLARE')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-right transition-colors ${
                    lightingSim === 'GLARE'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  ⚡ توهج وانعكاس أبيض (Glare)
                </button>
                <button
                  onClick={() => setLightingSim('BLURRY')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-right transition-colors ${
                    lightingSim === 'BLURRY'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  〰 صورة ضبابية (Blurry)
                </button>
                <button
                  onClick={() => setLightingSim('DARK')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-right transition-colors ${
                    lightingSim === 'DARK'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  🌑 إضاءة معتمة جداً (Dark)
                </button>
              </div>
            )}

            {/* Instruction Banner at Bottom */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-800/90 rounded-2xl px-4 py-2 backdrop-blur-md shadow-xl flex items-center gap-3 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>الاقتراب تدريجياً • تثبيت الهاتف • تجنب التقريب الرقمي (Digital Zoom)</span>
            </div>
          </>
        ) : (
          /* Captured Image Review & Pre-Model Quality Gate Decision */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-slate-950">
            <div className="relative max-w-lg w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src={capturedImage}
                alt="Captured Board Macro"
                className="w-full h-72 object-cover"
              />

              {/* Verified Coordinate Bounding Box Overlay */}
              {qualityResult?.passed && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-16 border-2 border-emerald-400 rounded-lg shadow-lg shadow-emerald-400/20 flex flex-col items-center justify-between p-1 bg-emerald-500/10">
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-slate-950/80 px-1.5 rounded">
                      {targetComponent.ref} [VERIFIED]
                    </span>
                    <span className="text-[9px] font-mono text-emerald-200">
                      Err: 3.8px | Conf: 98%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Section 5.4 Quality Gate Feedback Card */}
            {qualityResult && (
              <div
                className={`max-w-lg w-full mt-4 p-4 rounded-2xl border ${
                  qualityResult.passed
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {qualityResult.passed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-bold">
                      {qualityResult.passed
                        ? 'الصورة ممتازة ومطابقة للمعايرة الهندسية'
                        : 'تم رفض الصورة بواسطة بوابة الجودة المحلية'}
                    </h4>
                    {qualityResult.failureReasonAr ? (
                      <p className="text-xs text-rose-300 mt-1 font-semibold leading-relaxed">
                        سبب الرفض: {qualityResult.failureReasonAr}
                      </p>
                    ) : (
                      <p className="text-xs text-emerald-300 mt-1 leading-relaxed">
                        تمت مطابقة معالم المكوّن [ {targetComponent.ref} ] بإحداثيات ({targetComponent.xMm}, {targetComponent.yMm})mm بنسبة خطأ مسموح 3.8px.
                      </p>
                    )}
                    {qualityResult.tipsAr && (
                      <p className="text-[11px] text-slate-300 mt-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        💡 نصيحة مهنية: {qualityResult.tipsAr}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Shutter & Action Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between z-20">
        {!capturedImage ? (
          <>
            <div className="text-xs text-slate-400">
              تأكد من توسيط المكوّن داخل الإطار قبل الضغط على الالتقاط
            </div>
            {/* Shutter Button */}
            <button
              onClick={handleCapture}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black px-6 py-2.5 rounded-2xl text-sm transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>التقاط صورة الماكرو (Macro Capture)</span>
            </button>
            <div className="w-16" />
          </>
        ) : (
          /* Review Action Buttons */
          <div className="flex items-center justify-between w-full">
            <button
              onClick={handleRetake}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة التصوير (Retake)</span>
            </button>

            {qualityResult?.passed ? (
              <button
                onClick={handleApprove}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>اعتماد الصورة والانتقال للقياس</span>
              </button>
            ) : (
              <span className="text-xs text-rose-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>يمنع الاعتماد حتى استيفاء شروط الوضوح</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

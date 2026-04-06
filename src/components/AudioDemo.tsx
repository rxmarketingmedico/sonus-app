import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Headphones, Volume2 } from "lucide-react";
import { BinauralAudioEngine } from "@/lib/audioEngine";
import { Button } from "@/components/ui/button";

const MODES = [
  { id: "sleep", label: "🌙 Sleep", carrier: 200, beat: 2, color: "from-indigo-500 to-purple-600" },
  { id: "calm", label: "🧘 Calm", carrier: 250, beat: 6, color: "from-cyan-500 to-teal-600" },
  { id: "focus", label: "⚡ Focus", carrier: 300, beat: 40, color: "from-amber-500 to-orange-600" },
];

const MAX_DEMO_SECONDS = 30;

const AudioDemo = ({ ctaText, onCta }: { ctaText: string; onCta: () => void }) => {
  const [activeMode, setActiveMode] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(MAX_DEMO_SECONDS);
  const engineRef = useRef<BinauralAudioEngine | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const stopAll = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    cancelAnimationFrame(animFrameRef.current);
    if (engineRef.current) {
      await engineRef.current.stop();
      engineRef.current = null;
    }
    setPlaying(false);
    setSecondsLeft(MAX_DEMO_SECONDS);
  }, []);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = engine.getWaveformData();
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (!data) {
      animFrameRef.current = requestAnimationFrame(drawWaveform);
      return;
    }

    // Draw real waveform
    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, "rgba(139,92,246,0.8)");
    gradient.addColorStop(0.5, "rgba(34,211,238,0.8)");
    gradient.addColorStop(1, "rgba(139,92,246,0.8)");

    ctx.lineWidth = 2;
    ctx.strokeStyle = gradient;
    ctx.beginPath();

    const sliceWidth = w / data.length;
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * h) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Glow effect
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(139,92,246,0.15)";
    ctx.stroke();

    animFrameRef.current = requestAnimationFrame(drawWaveform);
  }, []);

  const handlePlay = async () => {
    if (playing) {
      await stopAll();
      return;
    }

    const mode = MODES[activeMode];
    const engine = new BinauralAudioEngine();
    engineRef.current = engine;
    await engine.start(mode.carrier, mode.beat, 0.4);

    setPlaying(true);
    setSecondsLeft(MAX_DEMO_SECONDS);

    // Countdown
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          stopAll();
          return MAX_DEMO_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    // Start waveform visualization
    drawWaveform();
  };

  const handleModeChange = async (idx: number) => {
    if (playing) await stopAll();
    setActiveMode(idx);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mode selector */}
      <div className="flex justify-center gap-3 mb-8">
        {MODES.map((mode, i) => (
          <button
            key={mode.id}
            onClick={() => handleModeChange(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              activeMode === i
                ? "gradient-primary text-primary-foreground border-transparent"
                : "bg-card/50 text-muted-foreground border-border/50 hover:border-sonus-purple/30"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Waveform display */}
      <div className="relative bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 mb-6">
        {/* Canvas for real waveform */}
        <div className="relative h-32 md:h-40 mb-4 overflow-hidden rounded-xl bg-background/50">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />

          {/* Idle state animated bars */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-[3px]">
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[2px] rounded-full bg-gradient-to-t from-sonus-purple/30 to-sonus-cyan/30"
                    animate={{
                      height: [4, 8 + Math.random() * 8, 4],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      delay: i * 0.05,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  Use headphones for the best experience
                </p>
              </div>
            </div>
          )}

          {/* Playing indicator */}
          <AnimatePresence>
            {playing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 rounded-full bg-sonus-purple/20 border border-sonus-purple/30"
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-sonus-purple"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs text-sonus-purple font-medium">
                  {secondsLeft}s
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Play button + info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-foreground font-display font-semibold">
              {MODES[activeMode].label.split(" ")[1]} Mode
            </p>
            <p className="text-xs text-muted-foreground">
              {playing ? "Playing — 30s demo" : "Tap play to preview"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={handlePlay}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-sonus-purple/30"
            >
              {playing ? (
                <Pause className="w-6 h-6 text-primary-foreground" />
              ) : (
                <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center"
      >
        <Button
          onClick={onCta}
          className="gradient-primary text-primary-foreground border-0 glow-purple px-8 py-3 text-base"
        >
          {ctaText}
        </Button>
      </motion.div>
    </div>
  );
};

export default AudioDemo;

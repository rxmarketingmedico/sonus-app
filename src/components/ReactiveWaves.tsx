import { useRef, useEffect, useCallback } from "react";
import { BinauralAudioEngine } from "@/lib/audioEngine";

interface ReactiveWavesProps {
  engine: BinauralAudioEngine | null;
  isPlaying: boolean;
  isPaused: boolean;
}

const WAVE_LAYERS = 3;
const LAYER_COLORS = [
  { r: 130, g: 80, b: 255 },   // purple
  { r: 50, g: 140, b: 255 },   // blue
  { r: 0, g: 210, b: 200 },    // cyan
];

const ReactiveWaves = ({ engine, isPlaying, isPaused }: ReactiveWavesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !engine) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const waveform = engine.getWaveformData();
    const freq = engine.getFrequencyData();

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (!waveform || !freq) {
      animFrameRef.current = requestAnimationFrame(draw);
      return;
    }

    // Calculate overall energy from frequency data for glow intensity
    let energy = 0;
    for (let i = 0; i < freq.length / 4; i++) {
      energy += freq[i];
    }
    energy = energy / (freq.length / 4) / 255;

    const sliceWidth = w / waveform.length;

    for (let layer = 0; layer < WAVE_LAYERS; layer++) {
      const color = LAYER_COLORS[layer];
      const yOffset = (layer - 1) * 30;
      const alpha = 0.4 - layer * 0.1 + energy * 0.3;
      const amplitudeScale = 1.5 + layer * 0.5 + energy * 2;

      ctx.beginPath();
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
      ctx.lineWidth = 2 - layer * 0.3;
      ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${energy * 0.6})`;
      ctx.shadowBlur = 10 + energy * 20;

      let x = 0;
      for (let i = 0; i < waveform.length; i++) {
        // Normalize waveform: 128 = silence, 0/255 = peaks
        const v = (waveform[i] - 128) / 128;
        const y = (h / 2) + yOffset + v * (h / 2) * amplitudeScale * 0.4;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw filled area underneath with low opacity
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.08})`;
      ctx.fill();
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }, [engine]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      animFrameRef.current = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animFrameRef.current);
      // Clear canvas when paused
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, isPaused, draw]);

  if (!isPlaying) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

export default ReactiveWaves;

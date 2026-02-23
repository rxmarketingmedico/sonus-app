import { motion } from "framer-motion";
import { useMemo } from "react";

interface ReactiveWavesProps {
  beatHz: number;
  isPlaying: boolean;
  isPaused: boolean;
}

const ReactiveWaves = ({ beatHz, isPlaying, isPaused }: ReactiveWavesProps) => {
  // Map beat frequency to visual parameters
  const waveConfig = useMemo(() => {
    // Lower freq = slower, wider waves. Higher freq = faster, tighter waves
    const speed = Math.max(2, 12 - beatHz * 0.5);
    const amplitude = 20 + beatHz * 2;
    const layers = 3;
    return { speed, amplitude, layers };
  }, [beatHz]);

  if (!isPlaying || isPaused) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {Array.from({ length: waveConfig.layers }).map((_, i) => {
        const delay = i * 0.8;
        const yOffset = 40 + i * 8;
        const opacity = 0.6 - i * 0.15;

        return (
          <motion.svg
            key={i}
            className="absolute bottom-0 left-0 w-[200%] h-full"
            viewBox="0 0 2880 320"
            preserveAspectRatio="none"
            animate={{ x: [0, -1440] }}
            transition={{
              duration: waveConfig.speed + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ opacity }}
          >
            <path
              fill="none"
              stroke={`url(#waveGrad${i})`}
              strokeWidth="2"
              d={`M0,${160 + yOffset} ${Array.from({ length: 24 }, (_, j) => {
                const x = j * 120;
                const cp1x = x + 30;
                const cp2x = x + 90;
                const nextX = x + 120;
                const yUp = 160 + yOffset - waveConfig.amplitude;
                const yDown = 160 + yOffset + waveConfig.amplitude;
                return `C${cp1x},${j % 2 === 0 ? yUp : yDown} ${cp2x},${j % 2 === 0 ? yUp : yDown} ${nextX},${160 + yOffset}`;
              }).join(" ")}`}
            />
            <defs>
              <linearGradient id={`waveGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(260, 80%, 60%)" stopOpacity="0.8" />
                <stop offset="50%" stopColor="hsl(200, 90%, 50%)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(190, 90%, 50%)" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </motion.svg>
        );
      })}
    </div>
  );
};

export default ReactiveWaves;

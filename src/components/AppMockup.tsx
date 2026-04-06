import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Moon, BarChart3, Heart, Volume2, Wind } from "lucide-react";

/* ---- Phone Frame wrapper ---- */
const PhoneFrame = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative mx-auto ${className}`}>
    {/* Glow */}
    <motion.div
      className="absolute -inset-6 rounded-[3rem] bg-sonus-purple/20 blur-3xl"
      animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Phone body */}
    <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[2.5rem] p-2 shadow-2xl border border-zinc-700/50">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-900 rounded-b-2xl z-20" />
      {/* Screen */}
      <div className="rounded-[2rem] overflow-hidden bg-background relative">
        {children}
      </div>
    </div>
  </div>
);

/* ---- Session Screen Mockup ---- */
export const SessionMockup = () => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [frequency, setFrequency] = useState(40);

  useEffect(() => {
    const timer = setTimeout(() => setPlaying(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.5));
      setFrequency((f) => 40 + Math.sin(Date.now() / 2000) * 5);
    }, 50);
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <PhoneFrame className="w-56 md:w-64">
      <div className="h-[440px] md:h-[500px] bg-gradient-to-b from-background via-background to-sonus-purple/10 p-5 flex flex-col">
        {/* Header */}
        <div className="text-center mt-6 mb-4">
          <p className="text-xs text-muted-foreground mb-1">Focus Mode</p>
          <p className="text-2xl font-display font-bold text-gradient">{frequency.toFixed(1)} Hz</p>
        </div>

        {/* Animated sound waves */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Circular pulse rings */}
          {playing && [0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute w-20 h-20 rounded-full border border-sonus-purple/30"
              animate={{
                scale: [1, 3.5],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: "easeOut",
              }}
            />
          ))}

          {/* SVG sine waves */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 200" preserveAspectRatio="none">
            {[
              { amplitude: 18, freq: 0.04, speed: 2, color: "rgba(139,92,246,0.5)", strokeWidth: 2 },
              { amplitude: 12, freq: 0.06, speed: 3, color: "rgba(34,211,238,0.4)", strokeWidth: 1.5 },
              { amplitude: 25, freq: 0.03, speed: 1.5, color: "rgba(139,92,246,0.25)", strokeWidth: 2.5 },
            ].map((wave, wi) => (
              <motion.path
                key={wi}
                fill="none"
                stroke={wave.color}
                strokeWidth={wave.strokeWidth}
                strokeLinecap="round"
                d={`M 0 100 ${Array.from({ length: 29 }).map((_, x) => {
                  const px = x * 10;
                  const py = 100 + wave.amplitude * Math.sin(px * wave.freq);
                  return `L ${px} ${py}`;
                }).join(" ")}`}
                animate={playing ? {
                  x: [-20, 20, -20],
                  opacity: [0.6, 1, 0.6],
                } : { x: 0, opacity: 0.3 }}
                transition={{
                  duration: wave.speed,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </svg>

          {/* Central bar visualizer */}
          <div className="flex items-center gap-[2px] z-10">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full bg-gradient-to-t from-sonus-purple to-sonus-cyan"
                animate={playing ? {
                  height: [6, 14 + Math.random() * 24, 6],
                } : { height: 6 }}
                transition={{
                  duration: 0.8 + Math.random() * 0.4,
                  repeat: Infinity,
                  delay: i * 0.04,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="h-1 bg-border/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">{Math.floor(progress * 0.15)}:00</span>
            <span className="text-[10px] text-muted-foreground">15:00</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <motion.button
            className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center"
            animate={{ scale: playing ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <Pause className="w-5 h-5 text-primary-foreground" /> : <Play className="w-5 h-5 text-primary-foreground ml-0.5" />}
          </motion.button>
          <Wind className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Ambient label */}
        <div className="text-center">
          <span className="text-[10px] px-3 py-1 rounded-full bg-sonus-purple/10 text-sonus-purple border border-sonus-purple/20">
            🌧 Rain + Thunder
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
};

/* ---- Dashboard Screen Mockup ---- */
export const DashboardMockup = () => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStreak((s) => (s < 12 ? s + 1 : s));
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "Sessions", value: "47", icon: BarChart3 },
    { label: "Streak", value: `${streak}d`, icon: Heart },
    { label: "Sleep", value: "7.5h", icon: Moon },
  ];

  return (
    <PhoneFrame className="w-56 md:w-64">
      <div className="h-[440px] md:h-[500px] bg-gradient-to-b from-background to-sonus-blue/5 p-5 flex flex-col">
        {/* Header */}
        <div className="mt-6 mb-6">
          <p className="text-xs text-muted-foreground">Good evening,</p>
          <p className="text-lg font-display font-bold text-foreground">Sarah 👋</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.2 }}
              className="bg-card/50 border border-border/30 rounded-xl p-2.5 text-center"
            >
              <s.icon className="w-3.5 h-3.5 text-sonus-purple mx-auto mb-1" />
              <p className="text-sm font-bold text-foreground">{s.value}</p>
              <p className="text-[8px] text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart mockup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-card/30 border border-border/20 rounded-xl p-3 mb-4 flex-1"
        >
          <p className="text-[10px] text-muted-foreground mb-2">Weekly Progress</p>
          <div className="flex items-end gap-1.5 h-16">
            {[40, 65, 50, 80, 70, 90, 60].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-sonus-purple to-sonus-cyan"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 1.5 + i * 0.1, duration: 0.4, ease: "easeOut" }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className="text-[7px] text-muted-foreground flex-1 text-center">{d}</span>
            ))}
          </div>
        </motion.div>

        {/* Mood */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="bg-card/30 border border-border/20 rounded-xl p-3"
        >
          <p className="text-[10px] text-muted-foreground mb-1.5">Today's mood</p>
          <div className="flex gap-2 justify-center">
            {["😞", "😕", "😐", "🙂", "😊"].map((e, i) => (
              <motion.span
                key={i}
                className={`text-lg cursor-pointer ${i === 3 ? "scale-125" : "opacity-40"}`}
                whileHover={{ scale: 1.3 }}
              >
                {e}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </PhoneFrame>
  );
};

/* ---- Sleep Log Mockup ---- */
export const SleepMockup = () => {
  const [quality, setQuality] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setQuality(4), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PhoneFrame className="w-56 md:w-64">
      <div className="h-[440px] md:h-[500px] bg-gradient-to-b from-background to-indigo-950/20 p-5 flex flex-col">
        {/* Header */}
        <div className="mt-6 mb-6 text-center">
          <Moon className="w-6 h-6 text-sonus-purple mx-auto mb-2" />
          <p className="text-lg font-display font-bold text-foreground">Sleep Log</p>
          <p className="text-xs text-muted-foreground">How did you sleep?</p>
        </div>

        {/* Time inputs */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card/50 border border-border/30 rounded-xl p-3 text-center"
          >
            <p className="text-[8px] text-muted-foreground mb-1">Bedtime</p>
            <p className="text-sm font-bold text-foreground">23:30</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-card/50 border border-border/30 rounded-xl p-3 text-center"
          >
            <p className="text-[8px] text-muted-foreground mb-1">Wake up</p>
            <p className="text-sm font-bold text-foreground">07:00</p>
          </motion.div>
        </div>

        {/* Hours result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="text-center mb-5"
        >
          <p className="text-3xl font-display font-bold text-gradient">7.5h</p>
          <p className="text-xs text-muted-foreground">of sleep</p>
        </motion.div>

        {/* Quality */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center mb-6"
        >
          <p className="text-[10px] text-muted-foreground mb-2">Quality</p>
          <div className="flex gap-3 justify-center">
            {["😞", "😕", "😐", "🙂", "😊"].map((e, i) => (
              <motion.span
                key={i}
                className="text-xl"
                animate={{
                  scale: i === quality ? 1.3 : 0.85,
                  opacity: i === quality ? 1 : 0.3,
                }}
                transition={{ delay: 1.5 + i * 0.08 }}
              >
                {e}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* History preview */}
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground mb-2">Last 7 nights</p>
          <div className="space-y-1.5">
            {[
              { date: "Today", hours: "7.5h", q: "🙂" },
              { date: "Yesterday", hours: "6.2h", q: "😐" },
              { date: "Apr 4", hours: "8.0h", q: "😊" },
            ].map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + i * 0.15 }}
                className="flex items-center justify-between bg-card/30 border border-border/20 rounded-lg px-3 py-1.5"
              >
                <span className="text-[9px] text-muted-foreground">{entry.date}</span>
                <span className="text-[10px] font-semibold text-foreground">{entry.hours}</span>
                <span className="text-sm">{entry.q}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};

import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "inhale" | "hold" | "exhale";

interface BreathworkGuideProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TOTAL_CYCLES = 5;

const BreathworkGuide = ({ onComplete, onSkip }: BreathworkGuideProps) => {
  const { t } = useLanguage();

  const PHASES: { phase: Phase; label: string; duration: number }[] = [
    { phase: "inhale", label: t("breathwork.inhale"), duration: 4 },
    { phase: "hold",   label: t("breathwork.hold"),   duration: 4 },
    { phase: "exhale", label: t("breathwork.exhale"), duration: 6 },
  ];

  const [cycle, setCycle] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PHASES[0].duration);

  const currentPhase = PHASES[phaseIndex];
  const progress = ((cycle * 3 + phaseIndex) / (TOTAL_CYCLES * 3)) * 100;

  useEffect(() => {
    if (cycle >= TOTAL_CYCLES) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const nextPhaseIndex = (phaseIndex + 1) % PHASES.length;
          const nextCycle = nextPhaseIndex === 0 ? cycle + 1 : cycle;
          setPhaseIndex(nextPhaseIndex);
          setCycle(nextCycle);
          return PHASES[nextPhaseIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseIndex, cycle, onComplete, PHASES]);

  const circleScale = currentPhase.phase === "inhale"
    ? { scale: [1, 1.6] }
    : currentPhase.phase === "hold"
    ? { scale: 1.6 }
    : { scale: [1.6, 1] };

  const circleDuration = currentPhase.duration;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sonus-cyan/5 blur-3xl animate-pulse" />
      </div>

      <div className="z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t("breathwork.before")}</p>
          <h2 className="font-display text-xl font-semibold text-foreground">{t("breathwork.title")}</h2>
        </motion.div>

        <div className="relative flex items-center justify-center mb-12">
          <motion.div
            className="absolute rounded-full bg-sonus-cyan/10"
            animate={circleScale}
            transition={{ duration: circleDuration, ease: "easeInOut" }}
            style={{ width: 220, height: 220 }}
          />
          <motion.div
            className="absolute rounded-full bg-sonus-purple/15"
            animate={circleScale}
            transition={{ duration: circleDuration, ease: "easeInOut", delay: 0.1 }}
            style={{ width: 180, height: 180 }}
          />
          <motion.div
            className="rounded-full gradient-primary glow-purple flex items-center justify-center"
            animate={circleScale}
            transition={{ duration: circleDuration, ease: "easeInOut", delay: 0.15 }}
            style={{ width: 130, height: 130 }}
          >
            <span className="font-display text-3xl font-bold text-primary-foreground">
              {secondsLeft}
            </span>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentPhase.phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="font-display text-2xl font-semibold text-foreground mb-2"
          >
            {currentPhase.label}
          </motion.p>
        </AnimatePresence>

        <p className="text-sm text-muted-foreground mb-10">
          {t("breathwork.cycle")} {Math.min(cycle + 1, TOTAL_CYCLES)} {t("onboarding.of")} {TOTAL_CYCLES}
        </p>

        <div className="w-48 h-1 bg-muted rounded-full mb-10">
          <motion.div
            className="h-full rounded-full bg-sonus-cyan"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <button
          onClick={onSkip}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("breathwork.skip")}
        </button>
      </div>
    </div>
  );
};

export default BreathworkGuide;

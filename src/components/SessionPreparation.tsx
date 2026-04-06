import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Headphones, Volume2, Armchair, Wind, ChevronRight, Sparkles } from "lucide-react";

interface SessionPreparationProps {
  onReady: () => void;
  modeName: string;
  frequencyLabel: string;
  beatHz: number;
  durationMin: number;
}

const steps = [
  { icon: Volume2, key: "step1" },
  { icon: Headphones, key: "step2" },
  { icon: Armchair, key: "step3" },
  { icon: Wind, key: "step4" },
] as const;

const SessionPreparation = ({ onReady, modeName, frequencyLabel, beatHz, durationMin }: SessionPreparationProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onReady();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sonus-purple/5 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-sonus-cyan/5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="z-10 w-full max-w-md flex flex-col items-center">
        {/* Session info header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t("prep.title")}</p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            {t(`mode.${modeName}` as any)}
          </h2>
          <p className="text-sm text-muted-foreground">{durationMin} {t("general.minutes")}</p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex gap-2 mb-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentStep
                  ? "w-8 bg-sonus-purple"
                  : i < currentStep
                  ? "w-4 bg-sonus-purple/50"
                  : "w-4 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon circle */}
            <div className="w-24 h-24 rounded-full gradient-primary glow-purple flex items-center justify-center mb-8">
              <Icon className="w-10 h-10 text-primary-foreground" />
            </div>

            <h3 className="font-display text-2xl font-bold text-foreground mb-3">
              {t(`prep.${step.key}.title` as any)}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-10">
              {t(`prep.${step.key}.desc` as any)}
            </p>

            {/* Headphones warning badge on step 2 */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-sonus-cyan/30 bg-sonus-cyan/5 text-sonus-cyan text-xs mb-6"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t("prep.headphones")}
              </motion.div>
            )}

            {/* Breathing animation on step 4 */}
            {currentStep === 3 && (
              <motion.div
                className="w-16 h-16 rounded-full gradient-primary opacity-50 mb-6"
                animate={{
                  scale: [1, 1.5, 1.5, 1],
                  opacity: [0.3, 0.6, 0.6, 0.3],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  times: [0, 0.4, 0.6, 1],
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-3 mt-2">
          <Button
            onClick={handleNext}
            className="px-10 py-6 text-lg gradient-primary text-primary-foreground border-0 rounded-full glow-purple"
          >
            {isLastStep ? t("prep.ready") : t("prep.next")}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>

          <button
            onClick={onReady}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("prep.skip")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionPreparation;

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const emojis = ["😞", "😕", "😐", "🙂", "😊"];

interface MoodCheckInProps {
  onSelect: (mood: number) => void;
  onSkip: () => void;
}

const MoodCheckIn = ({ onSelect, onSkip }: MoodCheckInProps) => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sonus-purple/5 blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 text-center max-w-sm"
      >
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          {t("mood.pre.title")}
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          {t("mood.pre.subtitle")}
        </p>

        <div className="flex justify-center gap-4 mb-10">
          {emojis.map((emoji, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`text-4xl p-2 rounded-xl transition-all ${
                selected === i
                  ? "scale-125 bg-sonus-purple/20 ring-2 ring-sonus-purple"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={() => selected !== null && onSelect(selected + 1)}
            disabled={selected === null}
            className="w-full gradient-primary text-primary-foreground border-0 glow-purple"
          >
            {t("mood.pre.continue")}
          </Button>
          <button
            onClick={onSkip}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("mood.pre.skip")}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MoodCheckIn;

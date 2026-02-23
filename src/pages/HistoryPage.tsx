import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { getSessions } from "@/lib/storage";
import { FREQUENCY_PRESETS } from "@/lib/types";

const HistoryPage = () => {
  const { t } = useLanguage();
  const sessions = getSessions();

  const feedbackEmojis = ["", "😞", "😕", "😐", "🙂", "😊"];

  return (
    <div className="min-h-screen pb-24 md:pb-8 px-4 pt-8 max-w-2xl mx-auto">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl font-bold text-foreground mb-6">
        {t("dashboard.history")}
      </motion.h1>

      <div className="space-y-3">
        {sessions.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card/50 border border-border/50 rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground capitalize">{s.mode}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {FREQUENCY_PRESETS[s.mode]?.label}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round(s.duration / 60)} min · {new Date(s.date).toLocaleDateString()} {new Date(s.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <div className="text-2xl">
              {s.feedback ? feedbackEmojis[s.feedback] : "–"}
            </div>
          </motion.div>
        ))}
        {sessions.length === 0 && (
          <p className="text-muted-foreground text-center py-12">{t("dashboard.noSessions")}</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;

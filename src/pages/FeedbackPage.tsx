import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { updateSessionFeedback } from "@/lib/storage";
import { Button } from "@/components/ui/button";

const emojis = ["😞", "😕", "😐", "🙂", "😊"];

const FeedbackPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId") || "";
  const [selected, setSelected] = useState<number | null>(null);

  const handleSave = () => {
    if (selected !== null) {
      updateSessionFeedback(sessionId, selected + 1);
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
        <h1 className="font-display text-2xl font-bold text-foreground mb-8">{t("feedback.title")}</h1>

        <div className="flex justify-center gap-4 mb-10">
          {emojis.map((emoji, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`text-4xl p-2 rounded-xl transition-all ${
                selected === i ? "scale-125 bg-sonus-purple/20 ring-2 ring-sonus-purple" : "opacity-50 hover:opacity-80"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex-1">
            {t("feedback.skip")}
          </Button>
          <Button onClick={handleSave} disabled={selected === null} className="flex-1 gradient-primary text-primary-foreground border-0">
            {t("feedback.save")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackPage;

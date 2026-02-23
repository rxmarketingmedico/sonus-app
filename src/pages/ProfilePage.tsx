import { useLanguage } from "@/i18n/LanguageContext";
import { getProfile } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Globe, RefreshCw } from "lucide-react";

const ProfilePage = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const profile = getProfile();

  return (
    <div className="min-h-screen pb-24 md:pb-8 px-4 pt-8 max-w-md mx-auto">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl font-bold text-foreground mb-8">
        {t("profile.title")}
      </motion.h1>

      <div className="space-y-4">
        {/* Language */}
        <div className="bg-card/50 border border-border/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{t("profile.language")}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("pt-BR")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  language === "pt-BR" ? "border-sonus-purple bg-sonus-purple/10 text-foreground" : "border-border text-muted-foreground"
                }`}
              >
                PT-BR
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  language === "en" ? "border-sonus-purple bg-sonus-purple/10 text-foreground" : "border-border text-muted-foreground"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Profile info */}
        {profile && (
          <div className="bg-card/50 border border-border/50 rounded-xl p-4 space-y-2">
            <div className="text-sm text-muted-foreground">
              Objetivo: <span className="text-foreground capitalize">{profile.goal}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Período: <span className="text-foreground capitalize">{profile.period}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Estresse: <span className="text-foreground capitalize">{profile.stressLevel}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Duração: <span className="text-foreground">{profile.duration} min</span>
            </div>
          </div>
        )}

        {/* Redo Onboarding */}
        <Button variant="outline" className="w-full" onClick={() => { localStorage.removeItem("sonus-profile"); navigate("/onboarding"); }}>
          <RefreshCw className="w-4 h-4 mr-2" />
          {t("profile.editOnboarding")}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;

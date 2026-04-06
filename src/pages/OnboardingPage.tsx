import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { saveProfile } from "@/lib/storage";
import { saveProfileToSupabase } from "@/services/supabase";
import type { UserProfile } from "@/lib/types";
import type { Goal, Period, StressLevel, SessionDuration } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const OnboardingPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | "">("");
  const [stress, setStress] = useState<StressLevel | "">("");
  const [period, setPeriod] = useState<Period | "">("");
  const [duration, setDuration] = useState<SessionDuration | 0>(0);

  const totalSteps = 4;

  const steps = [
    {
      title: t("onboarding.step1.title"),
      options: [
        { value: "sleep", label: t("onboarding.step1.option1"), icon: "🌙" },
        { value: "calm", label: t("onboarding.step1.option2"), icon: "🧘" },
        { value: "tension", label: t("onboarding.step1.option3"), icon: "💆" },
        { value: "focus", label: t("onboarding.step1.option4"), icon: "🎯" },
      ],
      selected: goal,
      onSelect: (v: string) => setGoal(v as Goal),
    },
    {
      title: t("onboarding.step2.title"),
      options: [
        { value: "low", label: t("onboarding.step2.option1"), icon: "😌" },
        { value: "medium", label: t("onboarding.step2.option2"), icon: "😐" },
        { value: "high", label: t("onboarding.step2.option3"), icon: "😰" },
      ],
      selected: stress,
      onSelect: (v: string) => setStress(v as StressLevel),
    },
    {
      title: t("onboarding.step3.title"),
      options: [
        { value: "morning", label: t("onboarding.step3.option1"), icon: "🌅" },
        { value: "afternoon", label: t("onboarding.step3.option2"), icon: "☀️" },
        { value: "evening", label: t("onboarding.step3.option3"), icon: "🌇" },
        { value: "night", label: t("onboarding.step3.option4"), icon: "🌙" },
      ],
      selected: period,
      onSelect: (v: string) => setPeriod(v as Period),
    },
    {
      title: t("onboarding.step4.title"),
      options: [
        { value: "5", label: t("onboarding.step4.option1"), icon: "⏱️" },
        { value: "10", label: t("onboarding.step4.option2"), icon: "⏱️" },
        { value: "15", label: t("onboarding.step4.option3"), icon: "⏱️" },
        { value: "20", label: t("onboarding.step4.option4"), icon: "⏱️" },
      ],
      selected: duration ? String(duration) : "",
      onSelect: (v: string) => setDuration(Number(v) as SessionDuration),
    },
  ];

  const currentStep = steps[step];
  const canProceed = currentStep.selected !== "" && currentStep.selected !== "0";

  const handleFinish = () => {
    const profile: UserProfile = {
      goal: goal as Goal,
      period: period as Period,
      stressLevel: stress as StressLevel,
      duration: duration as SessionDuration,
      onboardingComplete: true,
    };
    saveProfile(profile);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-sonus-purple/8 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-sonus-blue/8 blur-3xl" />

      <div className="w-full max-w-md z-10">
        <h2 className="font-display text-2xl font-bold text-center text-gradient mb-8">
          {t("onboarding.title")}
        </h2>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{t("onboarding.step")} {step + 1} {t("onboarding.of")} {totalSteps}</span>
          </div>
          <Progress value={((step + 1) / totalSteps) * 100} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-6 text-center">
              {currentStep.title}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {currentStep.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => currentStep.onSelect(opt.value)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    currentStep.selected === opt.value
                      ? "border-sonus-purple bg-sonus-purple/10 glow-purple"
                      : "border-border bg-card/50 hover:border-sonus-purple/30"
                  }`}
                >
                  <div className="text-2xl mb-2">{opt.icon}</div>
                  <div className="text-sm font-medium text-foreground">{opt.label}</div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              {t("onboarding.back")}
            </Button>
          )}
          {step < totalSteps - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="flex-1 gradient-primary text-primary-foreground border-0"
            >
              {t("onboarding.next")}
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={!canProceed}
              className="flex-1 gradient-primary text-primary-foreground border-0"
            >
              {t("onboarding.finish")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;

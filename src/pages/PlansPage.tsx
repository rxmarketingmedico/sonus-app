import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const HOTMART_MONTHLY = "https://pay.hotmart.com/B105258428G?off=flpzgbrw&checkoutMode=10";
const HOTMART_ANNUAL = "https://pay.hotmart.com/B105258428G?off=6ttxc4wf&checkoutMode=10";

const PlansPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string>("free");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.plan) setCurrentPlan(data.plan);
      });
  }, [user]);

  const isPro = currentPlan === "pro";

  const plans = [
    {
      name: t("plans.free"),
      price: "$0",
      features: [t("plans.free.f1"), t("plans.free.f2"), t("plans.free.f3")],
      current: !isPro,
    },
    {
      name: t("plans.pro") + " — " + t("sales.pricing.monthly"),
      price: "$7.99/" + t("sales.pricing.mo"),
      features: [t("plans.pro.f1"), t("plans.pro.f2"), t("plans.pro.f3"), t("plans.pro.f4"), t("plans.pro.f5")],
      current: isPro,
      highlight: true,
      url: HOTMART_MONTHLY,
    },
    {
      name: t("plans.pro") + " — " + t("sales.pricing.annual"),
      price: "$29.99/" + t("sales.pricing.yr"),
      features: [t("plans.pro.f1"), t("plans.pro.f2"), t("plans.pro.f3"), t("plans.pro.f4"), t("plans.pro.f5")],
      current: isPro,
      highlight: true,
      url: HOTMART_ANNUAL,
      bestValue: true,
    },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-8 px-4 pt-8 max-w-5xl mx-auto">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold text-center text-gradient mb-4">
        {t("plans.title")}
      </motion.h1>

      {isPro && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 mb-8 py-3 px-6 rounded-full gradient-primary text-primary-foreground font-semibold mx-auto w-fit"
        >
          <Crown className="w-5 h-5" />
          {t("sales.youArePro")}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl border p-6 relative ${
              plan.bestValue
                ? "border-sonus-purple glow-purple bg-card"
                : plan.highlight
                ? "border-sonus-purple/50 bg-card"
                : "border-border bg-card/50"
            }`}
          >
            {plan.bestValue && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-primary text-xs font-semibold text-primary-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {t("sales.pricing.bestValue")}
              </div>
            )}
            <h2 className="font-display text-lg font-bold text-foreground mb-1">{plan.name}</h2>
            <p className="font-display text-3xl font-bold text-gradient mb-6">{plan.price}</p>
            <ul className="space-y-3 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-sonus-neon flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            {plan.highlight && !isPro ? (
              <Button
                className="w-full gradient-primary text-primary-foreground border-0 rounded-full"
                onClick={() => window.open(plan.url, "_blank")}
              >
                {t("plans.upgrade")}
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="outline"
                disabled
              >
                {plan.current ? t("plans.current") : t("plans.upgrade")}
              </Button>
            )}
            {plan.highlight && !isPro && (
              <p className="text-xs text-muted-foreground text-center mt-3">{t("plans.trialNote")}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;

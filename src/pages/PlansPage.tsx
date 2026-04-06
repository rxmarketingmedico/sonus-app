import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PlansPage = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t("plans.free"),
      price: t("plans.free.price"),
      features: [t("plans.free.f1"), t("plans.free.f2"), t("plans.free.f3")],
      current: true,
    },
    {
      name: t("plans.pro"),
      price: t("plans.pro.price"),
      features: [t("plans.pro.f1"), t("plans.pro.f2"), t("plans.pro.f3"), t("plans.pro.f4"), t("plans.pro.f5")],
      current: false,
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-8 px-4 pt-8 max-w-3xl mx-auto">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold text-center text-gradient mb-10">
        {t("plans.title")}
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl border p-6 relative ${
              plan.highlight ? "border-sonus-purple glow-purple bg-card" : "border-border bg-card/50"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-primary text-xs font-semibold text-primary-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> PRO
              </div>
            )}
            <h2 className="font-display text-xl font-bold text-foreground mb-1">{plan.name}</h2>
            <p className="font-display text-3xl font-bold text-gradient mb-6">{plan.price}</p>
            <ul className="space-y-3 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-sonus-neon flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button
              className={`w-full ${plan.highlight ? "gradient-primary text-primary-foreground border-0" : ""}`}
              variant={plan.highlight ? "default" : "outline"}
              disabled={plan.current}
            >
              {plan.current ? t("plans.current") : t("plans.upgrade")}
            </Button>
            {plan.highlight && (
              <p className="text-xs text-muted-foreground text-center mt-3">{t("plans.trialNote")}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;

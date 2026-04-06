import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Crown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const HOTMART_MONTHLY = "https://pay.hotmart.com/B105258428G?off=flpzgbrw&checkoutMode=10";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
}

const PaywallModal = ({ open, onClose }: PaywallModalProps) => {
  const { t } = useLanguage();

  const features = [
    t("sales.pro.f1"),
    t("sales.pro.f2"),
    t("sales.pro.f3"),
    t("sales.pro.f4"),
    t("sales.pro.f5"),
    t("sales.pro.f6"),
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-card border border-border rounded-2xl p-8 max-w-md w-full z-10 overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full bg-sonus-purple/20 blur-3xl pointer-events-none" />

            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-primary-foreground" />
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                {t("paywall.title")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("paywall.desc")}
              </p>

              <ul className="space-y-3 mb-8 text-left">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-sonus-neon flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full gradient-primary text-primary-foreground font-semibold rounded-full py-6 text-base glow-purple"
                onClick={() => window.open(HOTMART_MONTHLY, "_blank")}
              >
                {t("paywall.cta")}
              </Button>

              <p className="text-xs text-muted-foreground mt-3">{t("paywall.guarantee")}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaywallModal;

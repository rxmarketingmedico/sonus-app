import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import logoSonus from "@/assets/logo-sonus.png";

const AuthPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sonus-purple" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Check if email has an active purchase
      const { data: purchases } = await supabase
        .from("purchases")
        .select("status")
        .eq("email", email.toLowerCase())
        .eq("status", "active")
        .limit(1);

      if (!purchases || purchases.length === 0) {
        toast.error(t("auth.noPurchase"));
        setSubmitting(false);
        return;
      }

      // Send magic link OTP
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      setOtpSent(true);
      toast.success(t("auth.otpSent"));
    } catch (err: any) {
      toast.error(err.message || t("auth.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) throw error;
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || t("auth.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-sonus-purple/10 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-sonus-blue/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">{t("auth.backToHome")}</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <img src={logoSonus} alt="Sonus" className="w-20 h-20 mx-auto mb-4 object-contain" />
          <h1 className="font-display text-3xl font-bold text-gradient mb-2">
            {t("auth.welcomeBack")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {otpSent ? t("auth.enterOtp") : t("auth.loginDesc")}
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-card/50 border-border/50 pl-10"
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-xl bg-sonus-purple/10 border border-sonus-purple/20 text-center"
            >
              <p className="text-xs text-sonus-purple">
                {t("auth.purchaseRequired")}
              </p>
            </motion.div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full gradient-primary text-primary-foreground border-0 glow-purple"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {t("auth.sendCode")}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <Input
              type="text"
              placeholder={t("auth.otpPlaceholder")}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="bg-card/50 border-border/50 text-center text-2xl tracking-[0.5em] font-mono"
            />

            <Button
              type="submit"
              disabled={submitting}
              className="w-full gradient-primary text-primary-foreground border-0 glow-purple"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {t("auth.verify")}
            </Button>

            <button
              type="button"
              onClick={() => { setOtpSent(false); setOtp(""); }}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("auth.changeEmail")}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AuthPage;

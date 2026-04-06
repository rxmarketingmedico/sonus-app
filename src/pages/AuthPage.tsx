import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import logoSonus from "@/assets/logo-sonus.png";

const AuthPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isSignUp) {
        // Check if email has an active purchase first
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

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success(t("auth.accountCreated"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || t("auth.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (result.error) {
      toast.error(String(result.error));
      return;
    }

    if (result.redirected) {
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-sonus-purple/10 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-sonus-blue/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      {/* Back to landing */}
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
            {isSignUp ? t("auth.createAccountDesc") : t("auth.loginDesc")}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-card/50 rounded-full p-1 border border-border/50">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
              !isSignUp ? "gradient-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {t("auth.signIn")}
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
              isSignUp ? "gradient-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {t("auth.createAccount")}
          </button>
        </div>

        {isSignUp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4 p-3 rounded-xl bg-sonus-purple/10 border border-sonus-purple/20 text-center"
          >
            <p className="text-xs text-sonus-purple">
              {t("auth.purchaseRequired")}
            </p>
          </motion.div>
        )}

        {/* Email form */}
        <form onSubmit={handleEmailAuth} className="space-y-3 mb-4">
          <Input
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-card/50 border-border/50"
          />
          <Input
            type="password"
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-card/50 border-border/50"
          />
          <Button
            type="submit"
            disabled={submitting}
            className="w-full gradient-primary text-primary-foreground border-0 glow-purple"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isSignUp ? t("auth.createAccount") : t("auth.signIn")}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-xs text-muted-foreground">{t("auth.or")}</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Google */}
        <Button
          variant="outline"
          className="w-full border-border/50"
          onClick={handleGoogleSignIn}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {t("auth.google")}
        </Button>
      </motion.div>
    </div>
  );
};

export default AuthPage;

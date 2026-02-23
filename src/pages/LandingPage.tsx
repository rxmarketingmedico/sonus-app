import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";

const WaveAnimation = () => (
  <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
    <svg className="w-[200%] h-full animate-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path
        fill="url(#waveGrad)"
        d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,128C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
      <defs>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(260, 80%, 60%)" />
          <stop offset="50%" stopColor="hsl(220, 90%, 55%)" />
          <stop offset="100%" stopColor="hsl(190, 90%, 50%)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const LandingPage = () => {
  const { t } = useLanguage();

  const features = [
    { title: t("landing.feature1.title"), desc: t("landing.feature1.desc"), icon: "✨" },
    { title: t("landing.feature2.title"), desc: t("landing.feature2.desc"), icon: "⚡" },
    { title: t("landing.feature3.title"), desc: t("landing.feature3.desc"), icon: "🧠" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background spheres */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-sonus-purple/10 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-sonus-blue/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      
      <WaveAnimation />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-2xl"
      >
        {/* Breathing sphere */}
        <motion.div
          className="w-24 h-24 mx-auto mb-8 rounded-full gradient-primary glow-purple"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <h1 className="font-display text-6xl md:text-7xl font-bold text-gradient mb-4">
          {t("landing.title")}
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 font-display mb-2">
          {t("landing.subtitle")}
        </p>
        <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
          {t("landing.description")}
        </p>

        <motion.a
          href="/onboarding"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block px-8 py-4 rounded-full gradient-primary text-primary-foreground font-display font-semibold text-lg glow-purple transition-all hover:shadow-lg"
        >
          {t("landing.cta")}
        </motion.a>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 z-10 max-w-4xl w-full"
      >
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center hover:border-sonus-purple/30 transition-colors"
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-xs text-muted-foreground/60 mt-16 max-w-md text-center z-10"
      >
        {t("landing.disclaimer")}
      </motion.p>
    </div>
  );
};

export default LandingPage;

import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Check, Moon, Brain, Zap, Heart, Shield, Star, ChevronDown, Play, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logoSonus from "@/assets/logo-sonus.png";

const HOTMART_MONTHLY = "https://pay.hotmart.com/B105258428G?off=flpzgbrw&checkoutMode=10";
const HOTMART_ANNUAL = "https://pay.hotmart.com/B105258428G?off=6ttxc4wf&checkoutMode=10";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const LandingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const problems = [
    { icon: Moon, text: t("sales.problem1") },
    { icon: Brain, text: t("sales.problem2") },
    { icon: Heart, text: t("sales.problem3") },
  ];

  const features = [
    { icon: Headphones, title: t("sales.feat1.title"), desc: t("sales.feat1.desc") },
    { icon: Brain, title: t("sales.feat2.title"), desc: t("sales.feat2.desc") },
    { icon: Moon, title: t("sales.feat3.title"), desc: t("sales.feat3.desc") },
    { icon: Zap, title: t("sales.feat4.title"), desc: t("sales.feat4.desc") },
    { icon: Shield, title: t("sales.feat5.title"), desc: t("sales.feat5.desc") },
    { icon: Heart, title: t("sales.feat6.title"), desc: t("sales.feat6.desc") },
  ];

  const testimonials = [
    { name: "Sarah M.", text: t("sales.test1"), stars: 5 },
    { name: "Carlos R.", text: t("sales.test2"), stars: 5 },
    { name: "Emily T.", text: t("sales.test3"), stars: 5 },
  ];

  const faqs = [
    { q: t("sales.faq1.q"), a: t("sales.faq1.a") },
    { q: t("sales.faq2.q"), a: t("sales.faq2.a") },
    { q: t("sales.faq3.q"), a: t("sales.faq3.a") },
    { q: t("sales.faq4.q"), a: t("sales.faq4.a") },
  ];

  const proFeatures = [
    t("sales.pro.f1"),
    t("sales.pro.f2"),
    t("sales.pro.f3"),
    t("sales.pro.f4"),
    t("sales.pro.f5"),
    t("sales.pro.f6"),
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-sonus-purple/10 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-sonus-blue/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-sonus-cyan/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-3xl"
        >
          <motion.img
            src={logoSonus}
            alt="Sonus"
            className="w-24 h-24 mx-auto mb-6 object-contain"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <h1 className="font-display text-5xl md:text-7xl font-bold text-gradient mb-4 leading-tight">
            {t("sales.hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-display mb-3">
            {t("sales.hero.subtitle")}
          </p>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
            {t("sales.hero.desc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground font-display font-semibold text-lg px-8 py-6 rounded-full glow-purple"
              onClick={() => navigate("/auth")}
            >
              <Play className="w-5 h-5 mr-2" />
              {t("sales.hero.cta")}
            </Button>
            <p className="text-sm text-muted-foreground">{t("sales.hero.noCreditCard")}</p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.9/5
            </span>
            <span>10,000+ {t("sales.hero.users")}</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 {...fadeUp} className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
            {t("sales.problem.title")}
          </motion.h2>
          <motion.p {...fadeUp} className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t("sales.problem.desc")}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((p, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center"
              >
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <p.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <p className="text-foreground/80 text-lg">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOLUTION / HOW IT WORKS ===== */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 {...fadeUp} className="font-display text-3xl md:text-5xl font-bold text-gradient mb-4">
            {t("sales.solution.title")}
          </motion.h2>
          <motion.p {...fadeUp} className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto">
            {t("sales.solution.desc")}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step, i) => (
              <motion.div
                key={step}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative"
              >
                <div className="w-12 h-12 rounded-full gradient-primary text-primary-foreground font-display font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                  {t(`sales.step${step}.title`)}
                </h3>
                <p className="text-muted-foreground">{t(`sales.step${step}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fadeUp} className="font-display text-3xl md:text-5xl font-bold text-center text-foreground mb-4">
            {t("sales.features.title")}
          </motion.h2>
          <motion.p {...fadeUp} className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            {t("sales.features.desc")}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-sonus-purple/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-sonus-purple/10 flex items-center justify-center mb-4 group-hover:bg-sonus-purple/20 transition-colors">
                  <f.icon className="w-6 h-6 text-sonus-purple" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fadeUp} className="font-display text-3xl md:text-5xl font-bold text-center text-foreground mb-4">
            {t("sales.testimonials.title")}
          </motion.h2>
          <motion.p {...fadeUp} className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            {t("sales.testimonials.desc")}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-card border border-border/50 rounded-2xl p-6"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4 italic">"{t.text}"</p>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-20 px-4" id="pricing">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 {...fadeUp} className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("sales.pricing.title")}
          </motion.h2>
          <motion.p {...fadeUp} className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto">
            {t("sales.pricing.desc")}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Monthly */}
            <motion.div {...fadeUp} className="bg-card border border-border/50 rounded-2xl p-8 relative">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{t("sales.pricing.monthly")}</h3>
              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-gradient">$7.99</span>
                <span className="text-muted-foreground">/{t("sales.pricing.mo")}</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                {proFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-sonus-neon flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full gradient-primary text-primary-foreground font-semibold rounded-full py-6"
                onClick={() => window.open(HOTMART_MONTHLY, "_blank")}
              >
                {t("sales.pricing.cta")}
              </Button>
              <p className="text-xs text-muted-foreground mt-3">{t("sales.pricing.guarantee")}</p>
            </motion.div>

            {/* Annual */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-card border-2 border-sonus-purple rounded-2xl p-8 relative glow-purple"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-xs font-semibold text-primary-foreground">
                {t("sales.pricing.bestValue")}
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{t("sales.pricing.annual")}</h3>
              <div className="mb-2">
                <span className="font-display text-4xl font-bold text-gradient">$29.99</span>
                <span className="text-muted-foreground">/{t("sales.pricing.yr")}</span>
              </div>
              <p className="text-sm text-sonus-neon mb-6 font-semibold">{t("sales.pricing.save")}</p>
              <ul className="space-y-3 mb-8 text-left">
                {proFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-sonus-neon flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full gradient-primary text-primary-foreground font-semibold rounded-full py-6"
                onClick={() => window.open(HOTMART_ANNUAL, "_blank")}
              >
                {t("sales.pricing.cta")}
              </Button>
              <p className="text-xs text-muted-foreground mt-3">{t("sales.pricing.guarantee")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp} className="font-display text-3xl md:text-5xl font-bold text-center text-foreground mb-12">
            {t("sales.faq.title")}
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl group"
              >
                <summary className="p-6 font-display font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">{faq.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sonus-purple/10 blur-3xl" />

        <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("sales.final.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t("sales.final.desc")}
          </p>
          <Button
            size="lg"
            className="gradient-primary text-primary-foreground font-display font-semibold text-lg px-10 py-6 rounded-full glow-purple"
            onClick={() => navigate("/auth")}
          >
            {t("sales.final.cta")}
          </Button>
          <p className="text-xs text-muted-foreground/60 mt-8 max-w-md mx-auto">
            {t("landing.disclaimer")}
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;

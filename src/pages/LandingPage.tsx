import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Check, Moon, Brain, Zap, Heart, Shield, Star, ChevronDown, Play, Headphones, Volume2, BarChart3, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logoSonus from "@/assets/logo-sonus.png";
import heroMockup from "@/assets/hero-mockup.png";
import waveBanner from "@/assets/wave-banner.jpg";
import sleepPerson from "@/assets/sleep-person.png";

const HOTMART_MONTHLY = "https://pay.hotmart.com/B105258428G?off=flpzgbrw&checkoutMode=10";
const HOTMART_ANNUAL = "https://pay.hotmart.com/B105258428G?off=6ttxc4wf&checkoutMode=10";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.12 } },
  viewport: { once: true, margin: "-50px" },
};

const staggerItem = {
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* Animated counter */
const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* Floating particles */
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-sonus-purple/30"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 3 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

/* Animated waveform SVG */
const AnimatedWaveform = () => (
  <div className="flex items-center justify-center gap-[3px] h-12">
    {Array.from({ length: 32 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-[3px] rounded-full bg-gradient-to-t from-sonus-purple to-sonus-cyan"
        animate={{
          height: [8, 20 + Math.random() * 28, 8],
        }}
        transition={{
          duration: 1 + Math.random() * 0.5,
          repeat: Infinity,
          delay: i * 0.05,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

/* Live breathing demo */
const BreathingDemo = () => {
  const [phase, setPhase] = useState(0);
  const labels = ["Inhale", "Hold", "Exhale"];

  useEffect(() => {
    const timings = [4000, 4000, 6000];
    const timer = setTimeout(() => setPhase((p) => (p + 1) % 3), timings[phase]);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="w-24 h-24 rounded-full bg-gradient-to-br from-sonus-purple/30 to-sonus-cyan/30 border border-sonus-purple/20"
        animate={{
          scale: phase === 0 ? 1.4 : phase === 1 ? 1.4 : 1,
          opacity: phase === 2 ? 0.4 : 0.8,
        }}
        transition={{ duration: phase === 0 ? 4 : phase === 2 ? 6 : 0.3, ease: "easeInOut" }}
      />
      <motion.span
        key={phase}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-display text-sonus-cyan"
      >
        {labels[phase]}
      </motion.span>
    </div>
  );
};

const LandingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  const problems = [
    { icon: Moon, text: t("sales.problem1"), emoji: "😴" },
    { icon: Brain, text: t("sales.problem2"), emoji: "🧠" },
    { icon: Heart, text: t("sales.problem3"), emoji: "😩" },
  ];

  const features = [
    { icon: Headphones, title: t("sales.feat1.title"), desc: t("sales.feat1.desc"), gradient: "from-purple-500 to-indigo-600" },
    { icon: Wind, title: t("sales.feat2.title"), desc: t("sales.feat2.desc"), gradient: "from-cyan-500 to-teal-600" },
    { icon: Moon, title: t("sales.feat3.title"), desc: t("sales.feat3.desc"), gradient: "from-indigo-500 to-blue-600" },
    { icon: Volume2, title: t("sales.feat4.title"), desc: t("sales.feat4.desc"), gradient: "from-green-500 to-emerald-600" },
    { icon: BarChart3, title: t("sales.feat5.title"), desc: t("sales.feat5.desc"), gradient: "from-amber-500 to-orange-600" },
    { icon: Heart, title: t("sales.feat6.title"), desc: t("sales.feat6.desc"), gradient: "from-pink-500 to-rose-600" },
  ];

  const testimonials = [
    { name: "Sarah M.", text: t("sales.test1"), stars: 5, avatar: "👩‍💼" },
    { name: "Carlos R.", text: t("sales.test2"), stars: 5, avatar: "👨‍💻" },
    { name: "Emily T.", text: t("sales.test3"), stars: 5, avatar: "👩‍🎨" },
  ];

  const faqs = [
    { q: t("sales.faq1.q"), a: t("sales.faq1.a") },
    { q: t("sales.faq2.q"), a: t("sales.faq2.a") },
    { q: t("sales.faq3.q"), a: t("sales.faq3.a") },
    { q: t("sales.faq4.q"), a: t("sales.faq4.a") },
  ];

  const proFeatures = [
    t("sales.pro.f1"), t("sales.pro.f2"), t("sales.pro.f3"),
    t("sales.pro.f4"), t("sales.pro.f5"), t("sales.pro.f6"),
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        <Particles />
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-sonus-purple/10 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-sonus-blue/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-sonus-cyan/5 blur-3xl" />

        <div className="z-10 max-w-6xl w-full flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left flex-1"
          >
            <motion.img
              src={logoSonus}
              alt="Sonus"
              className="w-36 h-36 mx-auto lg:mx-0 mb-6 object-contain"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4 leading-tight">
              {t("sales.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 font-display mb-3">
              {t("sales.hero.subtitle")}
            </p>
            <p className="text-muted-foreground mb-8 max-w-xl text-lg">
              {t("sales.hero.desc")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="gradient-primary text-primary-foreground font-display font-semibold text-lg px-8 py-6 rounded-full glow-purple"
                  onClick={() => navigate("/auth")}
                >
                  <Play className="w-5 h-5 mr-2" />
                  {t("sales.hero.cta")}
                </Button>
              </motion.div>
              <p className="text-sm text-muted-foreground">{t("sales.hero.noCreditCard")}</p>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.9/5
              </span>
              <span>10,000+ {t("sales.hero.users")}</span>
            </div>
          </motion.div>

          {/* Right: Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y: heroParallax }}
            className="flex-1 flex justify-center relative"
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-8 rounded-full bg-sonus-purple/20 blur-3xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <img
                src={heroMockup}
                alt="Sonus App"
                className="relative w-64 md:w-80 drop-shadow-2xl"
                width={800}
                height={1000}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* ===== SOCIAL PROOF BAR ===== */}
      <section className="py-10 border-y border-border/30 bg-card/20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            {...fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: 10000, suffix: "+", label: t("sales.hero.users") },
              { value: 50000, suffix: "+", label: "Sessions" },
              { value: 49, suffix: "/5", label: "Rating" },
              { value: 92, suffix: "%", label: "Sleep better" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="font-display text-3xl md:text-4xl font-bold text-gradient">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className="py-24 px-4 relative">
        <Particles />
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 {...fadeUp} className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
            {t("sales.problem.title")}
          </motion.h2>
          <motion.p {...fadeUp} className="text-lg text-muted-foreground mb-14 max-w-2xl mx-auto">
            {t("sales.problem.desc")}
          </motion.p>

          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((p, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center group hover:border-sonus-purple/30 transition-colors"
              >
                <span className="text-5xl mb-4 block">{p.emoji}</span>
                <p className="text-foreground/80 text-lg">{p.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== WAVE BANNER (visual break) ===== */}
      <section className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={waveBanner}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          loading="lazy"
          width={1920}
          height={600}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <AnimatedWaveform />
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fadeUp} className="font-display text-3xl md:text-5xl font-bold text-gradient mb-4 text-center">
            {t("sales.solution.title")}
          </motion.h2>
          <motion.p {...fadeUp} className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto text-center">
            {t("sales.solution.desc")}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-sonus-purple via-sonus-cyan to-sonus-purple opacity-20" />

            {[
              { num: "1", title: t("sales.step1.title"), desc: t("sales.step1.desc"), demo: <motion.div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sonus-purple/20 to-sonus-blue/20 border border-sonus-purple/20 flex items-center justify-center" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}><Zap className="w-8 h-8 text-sonus-purple" /></motion.div> },
              { num: "2", title: t("sales.step2.title"), desc: t("sales.step2.desc"), demo: <AnimatedWaveform /> },
              { num: "3", title: t("sales.step3.title"), desc: t("sales.step3.desc"), demo: <BreathingDemo /> },
            ].map((step, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="text-center relative"
              >
                <div className="w-12 h-12 rounded-full gradient-primary text-primary-foreground font-display font-bold text-xl flex items-center justify-center mx-auto mb-6 relative z-10">
                  {step.num}
                </div>

                {/* Live demo area */}
                <div className="bg-card/30 border border-border/30 rounded-2xl p-6 mb-4 h-36 flex items-center justify-center">
                  {step.demo}
                </div>

                <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== APP PREVIEW + SLEEP ===== */}
      <section className="py-24 px-4 bg-card/30 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            {...fadeUp}
            className="flex-1 relative"
          >
            <motion.div
              className="absolute -inset-12 rounded-full bg-sonus-blue/10 blur-3xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <img
              src={sleepPerson}
              alt="Peaceful sleep"
              className="relative w-full max-w-md mx-auto"
              loading="lazy"
              width={800}
              height={800}
            />
          </motion.div>

          <motion.div {...fadeUp} className="flex-1 space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {t("sales.features.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("sales.features.desc")}
            </p>
            <div className="space-y-4">
              {features.slice(0, 4).map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <f.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground text-sm">{f.title}</h4>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-sonus-purple/30 transition-all group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${f.gradient} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-4 bg-card/30 relative">
        <Particles />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.h2 {...fadeUp} className="font-display text-3xl md:text-5xl font-bold text-center text-foreground mb-4">
            {t("sales.testimonials.title")}
          </motion.h2>
          <motion.p {...fadeUp} className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            {t("sales.testimonials.desc")}
          </motion.p>

          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((review, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="bg-card border border-border/50 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 gradient-primary opacity-50" />
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{review.avatar}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.name}</p>
                    <div className="flex">
                      {Array.from({ length: review.stars }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-foreground/80 italic text-sm leading-relaxed">"{review.text}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-24 px-4 relative" id="pricing">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sonus-purple/5 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 {...fadeUp} className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("sales.pricing.title")}
          </motion.h2>
          <motion.p {...fadeUp} className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto">
            {t("sales.pricing.desc")}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Monthly */}
            <motion.div
              {...fadeUp}
              whileHover={{ y: -4 }}
              className="bg-card border border-border/50 rounded-2xl p-8 relative"
            >
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
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  className="w-full gradient-primary text-primary-foreground font-semibold rounded-full py-6"
                  onClick={() => window.open(HOTMART_MONTHLY, "_blank")}
                >
                  {t("sales.pricing.cta")}
                </Button>
              </motion.div>
              <p className="text-xs text-muted-foreground mt-3">{t("sales.pricing.guarantee")}</p>
            </motion.div>

            {/* Annual */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={{ y: -4 }}
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
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  className="w-full gradient-primary text-primary-foreground font-semibold rounded-full py-6"
                  onClick={() => window.open(HOTMART_ANNUAL, "_blank")}
                >
                  {t("sales.pricing.cta")}
                </Button>
              </motion.div>
              <p className="text-xs text-muted-foreground mt-3">{t("sales.pricing.guarantee")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 px-4 bg-card/30">
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
                className="bg-card border border-border/50 rounded-2xl group hover:border-sonus-purple/20 transition-colors"
              >
                <summary className="p-6 font-display font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">{faq.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sonus-purple/10 blur-3xl" />
        <Particles />

        <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center relative z-10">
          <motion.img
            src={logoSonus}
            alt="Sonus"
            className="w-28 h-28 mx-auto mb-6 object-contain"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("sales.final.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t("sales.final.desc")}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground font-display font-semibold text-lg px-10 py-6 rounded-full glow-purple"
              onClick={() => navigate("/auth")}
            >
              {t("sales.final.cta")}
            </Button>
          </motion.div>
          <p className="text-xs text-muted-foreground/60 mt-8 max-w-md mx-auto">
            {t("landing.disclaimer")}
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;

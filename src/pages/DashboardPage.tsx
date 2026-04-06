import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan } from "@/hooks/useUserPlan";
import { motion } from "framer-motion";
import { getSessions, getStreak, getProfile } from "@/lib/storage";
import { getSessionsFromSupabase } from "@/services/supabase";
import { supabase } from "@/integrations/supabase/client";
import { GOAL_TO_MODE, FREQUENCY_PRESETS, type SessionMode, type SessionRecord } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Moon, Wind, Target, Play, Flame, Brain, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";



const DashboardPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { } = useUserPlan();
  const navigate = useNavigate();
  const profile = getProfile();
  const localSessions = getSessions();
  const streak = getStreak();

  const [sessions, setSessions] = useState<SessionRecord[]>(localSessions);
  const [sessions, setSessions] = useState<SessionRecord[]>(localSessions);
  const [lastSleep, setLastSleep] = useState<{ hours: number; quality: number } | null>(null);

  const emojis = ["😞", "😕", "😐", "🙂", "😊"];

  useEffect(() => {
    if (!user) return;
    supabase
      .from("sleep_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const log = data[0];
          const [bh, bm] = log.bedtime.split(":").map(Number);
          const [wh, wm] = log.waketime.split(":").map(Number);
          let diff = (wh * 60 + wm) - (bh * 60 + bm);
          if (diff < 0) diff += 24 * 60;
          setLastSleep({ hours: Math.round((diff / 60) * 10) / 10, quality: log.quality });
        }
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getSessionsFromSupabase(user.id).then((cloudSessions) => {
      const localIds = new Set(localSessions.map((s) => s.id));
      const merged = [...localSessions];
      cloudSessions.forEach((cs) => {
        if (!localIds.has(cs.id)) merged.push(cs);
      });
      merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSessions(merged);
    });
  }, [user]);

  const modeFromProfile: SessionMode = profile ? GOAL_TO_MODE[profile.goal] : "calm";

  const handleStartSession = (mode: SessionMode) => {
    if (!canStartSession()) {
      setShowPaywall(true);
      return;
    }
    navigate(`/session?mode=${mode}`);
  };

  const quickModes = [
    { mode: "sleep" as SessionMode, label: t("dashboard.sleep"), desc: t("dashboard.sleep.desc"), icon: Moon, color: "from-indigo-600 to-blue-700" },
    { mode: "calm" as SessionMode, label: t("dashboard.calm"), desc: t("dashboard.calm.desc"), icon: Wind, color: "from-teal-600 to-cyan-700" },
    { mode: "alpha" as SessionMode, label: t("dashboard.alpha"), desc: t("dashboard.alpha.desc"), icon: Brain, color: "from-green-600 to-emerald-700" },
    { mode: "focus" as SessionMode, label: t("dashboard.focus"), desc: t("dashboard.focus.desc"), icon: Target, color: "from-amber-600 to-orange-700" },
  ];

  const getBestFrequency = () => {
    const modeScores: Record<string, { total: number; count: number }> = {};
    sessions.forEach((s) => {
      const mood = s.mood_post ?? s.feedback;
      if (mood) {
        if (!modeScores[s.mode]) modeScores[s.mode] = { total: 0, count: 0 };
        modeScores[s.mode].total += mood;
        modeScores[s.mode].count += 1;
      }
    });
    let best = "";
    let bestAvg = 0;
    Object.entries(modeScores).forEach(([mode, data]) => {
      const avg = data.total / data.count;
      if (avg > bestAvg) {
        bestAvg = avg;
        best = mode;
      }
    });
    return best ? t(`mode.${best}` as any) : "—";
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const daySessions = sessions.filter((s) => s.date.startsWith(dateStr));
    const feedbacks = daySessions.filter((s) => s.mood_post ?? s.feedback).map((s) => (s.mood_post ?? s.feedback)!);
    const avg = feedbacks.length ? feedbacks.reduce((a, b) => a + b, 0) / feedbacks.length : 0;
    return {
      day: d.toLocaleDateString(undefined, { weekday: "short" }),
      value: Math.round(avg * 10) / 10,
    };
  });

  const limitReached = isFree && !canStartSession();

  return (
    <div className="min-h-screen pb-24 md:pb-8 px-4 pt-8 max-w-4xl mx-auto">
      <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} />

      {/* Limit banner */}
      {limitReached && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl border border-sonus-purple/30 bg-sonus-purple/10 p-4 flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Crown className="w-4 h-4 text-sonus-purple" />
            {t("paywall.banner")}
          </div>
          <Button
            size="sm"
            className="gradient-primary text-primary-foreground rounded-full text-xs"
            onClick={() => window.open(HOTMART_MONTHLY, "_blank")}
          >
            {t("paywall.bannerCta")}
          </Button>
        </motion.div>
      )}

      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">{t("dashboard.welcome")}</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-sonus-purple">
            <Flame className="w-5 h-5" />
            <span className="font-display font-semibold">{streak} {t("dashboard.days")}</span>
          </div>
          <span className="text-muted-foreground text-sm">
            {t("dashboard.totalSessions")}: {sessions.length}
          </span>
          <div className="flex items-center gap-1.5 text-sonus-cyan">
            <Zap className="w-4 h-4" />
            <span className="text-sm">{t("dashboard.bestFrequency")}: {getBestFrequency()}</span>
          </div>
        </div>
      </motion.div>

      {/* Main CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Button
          onClick={() => handleStartSession(modeFromProfile)}
          className="w-full py-6 text-lg font-display font-semibold gradient-primary text-primary-foreground border-0 rounded-2xl glow-purple mb-8"
        >
          <Play className="w-5 h-5 mr-2" />
          {t("dashboard.start")}
        </Button>
      </motion.div>

      {/* Sleep Summary Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="bg-card/50 border border-border/50 rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t("sleep.card.title")}</p>
              {lastSleep ? (
                <p className="text-xs text-muted-foreground">
                  {lastSleep.hours}h — {emojis[(lastSleep.quality - 1)] || "😐"}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">{t("sleep.card.noLog")}</p>
              )}
            </div>
          </div>
          {!lastSleep && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs rounded-full"
              onClick={() => navigate("/sleep")}
            >
              {t("sleep.card.cta")}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Quick Modes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-display font-semibold text-foreground mb-4">{t("dashboard.quickModes")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {quickModes.map((m) => (
            <button
              key={m.mode}
              onClick={() => handleStartSession(m.mode)}
              className="bg-card/50 border border-border/50 rounded-2xl p-4 text-center hover:border-sonus-purple/30 transition-all group"
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <m.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium text-foreground">{m.label}</div>
              <div className="text-xs text-muted-foreground">{m.desc}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Emotional Evolution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display font-semibold text-foreground mb-4">{t("dashboard.evolution")}</h2>
        <div className="bg-card/50 border border-border/50 rounded-2xl p-4 mb-8">
          {sessions.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={last7Days}>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(220, 15%, 55%)" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} hide />
                <Tooltip
                  contentStyle={{ background: "hsl(230, 25%, 10%)", border: "1px solid hsl(230, 20%, 18%)", borderRadius: "8px" }}
                  labelStyle={{ color: "hsl(220, 20%, 95%)" }}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(260, 80%, 60%)" strokeWidth={2} dot={{ fill: "hsl(260, 80%, 60%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8 text-sm">{t("dashboard.noSessions")}</p>
          )}
        </div>
      </motion.div>

      {/* Recent Sessions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="font-display font-semibold text-foreground mb-4">{t("dashboard.history")}</h2>
        <div className="space-y-2">
          {sessions.slice(0, 5).map((s) => (
            <div key={s.id} className="bg-card/50 border border-border/50 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-foreground">{t(`mode.${s.mode}` as any)}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {Math.round(s.duration / 60)} min
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(s.date).toLocaleDateString()}
              </div>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">{t("dashboard.noSessions")}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;

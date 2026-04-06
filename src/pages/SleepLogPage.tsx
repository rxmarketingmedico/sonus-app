import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

import { motion } from "framer-motion";
import { Moon, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";


const emojis = ["😞", "😕", "😐", "🙂", "😊"];

const SLEEP_LOGS_KEY = "sonus-sleep-logs";

interface SleepLogEntry {
  id: string;
  bedtime: string;
  waketime: string;
  quality: number;
  hours: number;
  date: string;
}

const getLocalSleepLogs = (): SleepLogEntry[] => {
  const data = localStorage.getItem(SLEEP_LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalSleepLog = (entry: SleepLogEntry) => {
  const logs = getLocalSleepLogs();
  logs.unshift(entry);
  localStorage.setItem(SLEEP_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
};

const calcHours = (bedtime: string, waketime: string): number => {
  const [bh, bm] = bedtime.split(":").map(Number);
  const [wh, wm] = waketime.split(":").map(Number);
  let diff = (wh * 60 + wm) - (bh * 60 + bm);
  if (diff < 0) diff += 24 * 60;
  return Math.round((diff / 60) * 10) / 10;
};

const SleepLogPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();


  const [bedtime, setBedtime] = useState("23:00");
  const [waketime, setWaketime] = useState("07:00");
  const [quality, setQuality] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logs, setLogs] = useState<SleepLogEntry[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const local = getLocalSleepLogs();
    if (user) {
      const { data } = await supabase
        .from("sleep_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(7);

      if (data && data.length > 0) {
        const cloudLogs: SleepLogEntry[] = data.map((d: any) => ({
          id: d.id,
          bedtime: d.bedtime,
          waketime: d.waketime,
          quality: d.quality,
          hours: calcHours(d.bedtime, d.waketime),
          date: d.created_at,
        }));
        const localIds = new Set(local.map((l) => l.id));
        const merged = [...local];
        cloudLogs.forEach((cl) => {
          if (!localIds.has(cl.id)) merged.push(cl);
        });
        merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLogs(merged.slice(0, 7));
        return;
      }
    }
    setLogs(local.slice(0, 7));
  };

  const handleSubmit = async () => {
    if (quality === null) return;
    setSaving(true);

    const entry: SleepLogEntry = {
      id: crypto.randomUUID(),
      bedtime,
      waketime,
      quality: quality + 1,
      hours: calcHours(bedtime, waketime),
      date: new Date().toISOString(),
    };

    saveLocalSleepLog(entry);

    if (user) {
      await supabase.from("sleep_logs").insert({
        id: entry.id,
        user_id: user.id,
        bedtime,
        waketime,
        quality: entry.quality,
      });
    }

    setSaving(false);
    setSaved(true);
    setQuality(null);
    loadLogs();
    setTimeout(() => setSaved(false), 2000);
  };




  return (
    <div className="min-h-screen pb-24 md:pb-8 px-4 pt-8 max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl font-bold text-gradient mb-8 text-center"
      >
        {t("sleep.title")}
      </motion.h1>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 border border-border/50 rounded-2xl p-6 mb-8"
      >
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1.5">
              <Moon className="w-4 h-4" /> {t("sleep.bedtime")}
            </label>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground font-display text-lg focus:outline-none focus:ring-2 focus:ring-sonus-purple"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {t("sleep.waketime")}
            </label>
            <input
              type="time"
              value={waketime}
              onChange={(e) => setWaketime(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground font-display text-lg focus:outline-none focus:ring-2 focus:ring-sonus-purple"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-3 block">{t("sleep.quality")}</label>
          <div className="flex justify-center gap-4">
            {emojis.map((emoji, i) => (
              <button
                key={i}
                onClick={() => setQuality(i)}
                className={`text-3xl p-2 rounded-xl transition-all ${
                  quality === i
                    ? "scale-125 bg-sonus-purple/20 ring-2 ring-sonus-purple"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {bedtime && waketime && (
          <p className="text-center text-sm text-muted-foreground mb-4">
            ≈ {calcHours(bedtime, waketime)} {t("sleep.hoursSlept")}
          </p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={quality === null || saving}
          className="w-full gradient-primary text-primary-foreground border-0 glow-purple rounded-full py-5"
        >
          {saved ? "✓" : <><Save className="w-4 h-4 mr-2" /> {t("sleep.save")}</>}
        </Button>
      </motion.div>

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display font-semibold text-foreground mb-4">{t("sleep.history")}</h2>
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-card/50 border border-border/50 rounded-xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{emojis[(log.quality - 1)] || "😐"}</span>
                <div>
                  <span className="text-sm font-medium text-foreground">{log.hours}h</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {log.bedtime} → {log.waketime}
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(log.date).toLocaleDateString()}
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">{t("sleep.noLogs")}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SleepLogPage;

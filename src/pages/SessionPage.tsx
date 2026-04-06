import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { BinauralAudioEngine } from "@/lib/audioEngine";
import { FREQUENCY_PRESETS, type SessionMode, type AmbientSound } from "@/lib/types";
import { getProfile, saveSession } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { saveSessionToSupabase } from "@/services/supabase";
import { useUserPlan } from "@/hooks/useUserPlan";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Pause, Play, Square, Maximize, Wind } from "lucide-react";
import ReactiveWaves from "@/components/ReactiveWaves";
import SessionPreparation from "@/components/SessionPreparation";
import MoodCheckIn from "@/components/MoodCheckIn";
import BreathworkGuide from "@/components/BreathworkGuide";


const SessionPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { } = useUserPlan();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get("mode") || "calm") as SessionMode;
  const profile = getProfile();
  const targetDuration = (profile?.duration || 10) * 60;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showBreathwork, setShowBreathwork] = useState(false);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [moodPre, setMoodPre] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(50);
  const [ambientVol, setAmbientVol] = useState(30);
  const [ambient, setAmbient] = useState<AmbientSound>("none");
  const [showBreathing, setShowBreathing] = useState(true);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [showPaywall, setShowPaywall] = useState(false);

  const engineRef = useRef<BinauralAudioEngine | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const freq = FREQUENCY_PRESETS[mode];

  // Check session limit on mount
  useEffect(() => {
    if (!canStartSession()) {
      setShowPaywall(true);
    }
  }, []);

  const startSession = useCallback(async () => {
    const engine = new BinauralAudioEngine();
    engineRef.current = engine;
    await engine.start(freq.carrier, freq.beat, volume / 100);
    setIsPlaying(true);
    setIsPaused(false);

    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  }, [freq, volume]);

  const togglePause = async () => {
    if (!engineRef.current) return;
    if (isPaused) {
      await engineRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    } else {
      await engineRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const stopSession = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (engineRef.current) await engineRef.current.stop();

    const sessionData: import("@/lib/types").SessionRecord = {
      id: sessionId,
      mode,
      duration: elapsed,
      targetDuration,
      frequency: freq.beat,
      date: new Date().toISOString(),
      mood_pre: moodPre ?? undefined,
    };

    saveSession(sessionData);
    if (user) {
      saveSessionToSupabase(sessionData, user.id);
    }

    navigate(`/feedback?sessionId=${sessionId}`);
  }, [elapsed, freq, mode, navigate, sessionId, targetDuration, moodPre, user]);

  useEffect(() => {
    if (elapsed >= targetDuration && isPlaying) {
      stopSession();
    }
  }, [elapsed, targetDuration, isPlaying, stopSession]);

  useEffect(() => {
    engineRef.current?.setVolume(volume / 100);
  }, [volume]);

  useEffect(() => {
    if (!engineRef.current) return;
    if (ambient === "none") {
      engineRef.current.stopAmbient();
    } else {
      engineRef.current.startAmbientNoise(ambient, ambientVol / 100);
    }
  }, [ambient, ambientVol]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      engineRef.current?.stop();
    };
  }, []);

  const progress = (elapsed / targetDuration) * 100;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const circumference = 2 * Math.PI * 70;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Filter ocean for free users
  const allAmbientOptions: { value: AmbientSound; label: string }[] = [
    { value: "none", label: t("session.none") },
    { value: "rain", label: t("session.rain") },
    { value: "whitenoise", label: t("session.whitenoise") },
    { value: "ocean", label: t("session.ocean") },
  ];
  const ambientOptions = isFree
    ? allAmbientOptions.filter((a) => a.value !== "ocean")
    : allAmbientOptions;

  // Flow: Paywall check → Preparation → Breathwork (Pro only) → MoodCheckIn → Playing
  if (showPaywall) {
    return (
      <PaywallModal
        open={true}
        onClose={() => navigate("/dashboard")}
      />
    );
  }

  if (!showBreathwork && !showMoodCheckIn && !isPlaying) {
    return (
      <SessionPreparation
        onReady={() => {
          if (isFree) {
            // Skip breathwork for free users
            setShowMoodCheckIn(true);
          } else {
            setShowBreathwork(true);
          }
        }}
        modeName={mode}
        frequencyLabel={freq.label}
        beatHz={freq.beat}
        durationMin={Math.round(targetDuration / 60)}
      />
    );
  }

  if (showBreathwork && !showMoodCheckIn && !isPlaying) {
    return (
      <BreathworkGuide
        onComplete={() => { setShowBreathwork(false); setShowMoodCheckIn(true); }}
        onSkip={() => { setShowBreathwork(false); setShowMoodCheckIn(true); }}
      />
    );
  }

  if (showMoodCheckIn && !isPlaying) {
    return (
      <MoodCheckIn
        onSelect={(mood) => {
          setMoodPre(mood);
          setShowMoodCheckIn(false);
          startSession();
        }}
        onSkip={() => {
          setShowMoodCheckIn(false);
          startSession();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <ReactiveWaves engine={engineRef.current} isPlaying={isPlaying} isPaused={isPaused} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sonus-purple/5 blur-3xl animate-pulse-glow" />
      </div>

      <div className="z-10 flex flex-col items-center">
        <div className="relative mb-8">
          <svg width="180" height="180" className="transform -rotate-90">
            <circle cx="90" cy="90" r="70" fill="none" stroke="hsl(230, 20%, 18%)" strokeWidth="4" />
            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke="url(#timerGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(260, 80%, 60%)" />
                <stop offset="100%" stopColor="hsl(190, 90%, 50%)" />
              </linearGradient>
            </defs>
          </svg>

          {showBreathing && (
            <motion.div
              className="absolute inset-0 m-auto w-20 h-20 rounded-full gradient-primary opacity-40"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-3xl font-bold text-foreground">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-1">{t("session.title")}</p>
        <p className="text-base font-display font-semibold text-foreground mb-6">
          {t(`mode.${mode}` as any)}
        </p>

        <div className="flex gap-4 mb-8">
          <Button onClick={togglePause} variant="outline" size="icon" className="w-14 h-14 rounded-full border-border/50">
            {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
          </Button>
          <Button onClick={stopSession} variant="outline" size="icon" className="w-14 h-14 rounded-full border-destructive/50 text-destructive hover:bg-destructive/10">
            <Square className="w-5 h-5" />
          </Button>
          <Button onClick={toggleFullscreen} variant="outline" size="icon" className="w-14 h-14 rounded-full border-border/50">
            <Maximize className="w-5 h-5" />
          </Button>
        </div>

        <div className="w-64 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("session.volume")}: {volume}%</label>
            <Slider value={[volume]} onValueChange={(v) => setVolume(v[0])} max={100} step={1} />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">{t("session.ambient")}</label>
            <div className="flex gap-2 flex-wrap">
              {ambientOptions.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setAmbient(a.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    ambient === a.value ? "border-sonus-purple bg-sonus-purple/10 text-foreground" : "border-border text-muted-foreground"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
            {ambient !== "none" && (
              <div className="mt-2">
                <Slider value={[ambientVol]} onValueChange={(v) => setAmbientVol(v[0])} max={100} step={1} />
              </div>
            )}
          </div>

          <button
            onClick={() => setShowBreathing(!showBreathing)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              showBreathing ? "border-sonus-cyan bg-sonus-cyan/10 text-foreground" : "border-border text-muted-foreground"
            }`}
          >
            <Wind className="w-3 h-3 inline mr-1" />
            {t("session.breathe")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;

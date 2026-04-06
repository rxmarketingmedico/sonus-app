import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { getSessions } from "@/lib/storage";

export const useUserPlan = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPlan("free");
      setLoading(false);
      return;
    }
    supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setPlan(data?.plan || "free");
        setLoading(false);
      });
  }, [user]);

  const isPro = plan === "pro";
  const isFree = !isPro;

  const getTodaySessionCount = (): number => {
    const today = new Date().toISOString().split("T")[0];
    const sessions = getSessions();
    return sessions.filter((s) => s.date.startsWith(today)).length;
  };

  const canStartSession = (): boolean => {
    if (isPro) return true;
    return getTodaySessionCount() < 2;
  };

  const sessionsRemaining = (): number => {
    if (isPro) return Infinity;
    return Math.max(0, 2 - getTodaySessionCount());
  };

  return { plan, isPro, isFree, loading, canStartSession, sessionsRemaining, getTodaySessionCount };
};

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

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

  return { plan, isPro, isFree, loading };
};

import { supabase } from "@/integrations/supabase/client";
import type { SessionRecord, UserProfile } from "@/lib/types";

// SESSIONS
export const saveSessionToSupabase = async (session: SessionRecord, userId: string) => {
  const { error } = await supabase.from("sessions").insert({
    id: session.id,
    user_id: userId,
    mode: session.mode,
    duration: session.duration,
    target_duration: session.targetDuration,
    frequency: session.frequency,
    mood_pre: session.mood_pre ?? null,
    mood_post: session.mood_post ?? null,
    created_at: session.date,
  });
  if (error) console.error("Failed to save session to cloud:", error);
};

export const getSessionsFromSupabase = async (userId: string): Promise<SessionRecord[]> => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Failed to fetch sessions from cloud:", error);
    return [];
  }

  return (data ?? []).map((s: any) => ({
    id: s.id,
    mode: s.mode,
    duration: s.duration,
    targetDuration: s.target_duration,
    frequency: Number(s.frequency),
    date: s.created_at,
    mood_pre: s.mood_pre ?? undefined,
    mood_post: s.mood_post ?? undefined,
  }));
};

export const updateMoodPostInSupabase = async (sessionId: string, moodPost: number) => {
  const { error } = await supabase
    .from("sessions")
    .update({ mood_post: moodPost })
    .eq("id", sessionId);
  if (error) console.error("Failed to update mood_post in cloud:", error);
};

// PROFILE
export const saveProfileToSupabase = async (profile: UserProfile, userId: string) => {
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    goal: profile.goal,
    period: profile.period,
    stress_level: profile.stressLevel,
    duration: profile.duration,
    onboarding_complete: profile.onboardingComplete,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("Failed to save profile to cloud:", error);
};

export const getProfileFromSupabase = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    goal: data.goal,
    period: data.period,
    stressLevel: data.stress_level,
    duration: data.duration,
    onboardingComplete: data.onboarding_complete,
  } as UserProfile;
};

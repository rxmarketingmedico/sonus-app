export type Goal = "tension" | "calm" | "sleep" | "focus";
export type Period = "morning" | "afternoon" | "evening" | "night";
export type StressLevel = "low" | "medium" | "high";
export type SessionDuration = 5 | 10 | 15 | 20;
export type AmbientSound = "none" | "rain" | "whitenoise" | "ocean";
export type SessionMode = "sleep" | "calm" | "focus" | "alpha" | "custom";

export interface UserProfile {
  goal: Goal;
  period: Period;
  stressLevel: StressLevel;
  duration: SessionDuration;
  onboardingComplete: boolean;
}

export interface SessionRecord {
  id: string;
  mode: SessionMode;
  duration: number; // actual seconds
  targetDuration: number; // target seconds
  frequency: number;
  date: string;
  feedback?: number; // 1-5
}

export interface FrequencyConfig {
  carrier: number;
  beat: number;
  label: string;
  mode: SessionMode;
}

export const FREQUENCY_PRESETS: Record<SessionMode, FrequencyConfig> = {
  sleep: { carrier: 180, beat: 2, label: "Sleep better", mode: "sleep" },
  calm: { carrier: 200, beat: 6, label: "Feel calmer", mode: "calm" },
  alpha: { carrier: 210, beat: 10, label: "Relax deeply", mode: "alpha" },
  focus: { carrier: 220, beat: 16, label: "Focus sharp", mode: "focus" },
  custom: { carrier: 200, beat: 10, label: "Relax deeply", mode: "custom" },
};

export const GOAL_TO_MODE: Record<Goal, SessionMode> = {
  tension: "calm",
  calm: "calm",
  sleep: "sleep",
  focus: "focus",
};

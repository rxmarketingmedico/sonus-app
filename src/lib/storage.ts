import { UserProfile, SessionRecord } from "./types";

const PROFILE_KEY = "sonus-profile";
const SESSIONS_KEY = "sonus-sessions";

export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getSessions = (): SessionRecord[] => {
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSession = (session: SessionRecord) => {
  const sessions = getSessions();
  sessions.unshift(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 100)));
};

export const updateSessionMoodPost = (id: string, mood: number) => {
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx !== -1) {
    sessions[idx].mood_post = mood;
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }
};

export const updateSessionMoodPre = (id: string, mood: number) => {
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx !== -1) {
    sessions[idx].mood_pre = mood;
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }
};

/** @deprecated use updateSessionMoodPost */
export const updateSessionFeedback = (id: string, feedback: number) => {
  updateSessionMoodPost(id, feedback);
};

export const getStreak = (): number => {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;

  const dates = [...new Set(sessions.map((s) => s.date.split("T")[0]))].sort().reverse();
  let streak = 1;
  const today = new Date().toISOString().split("T")[0];

  if (dates[0] !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (dates[0] !== yesterday) return 0;
  }

  for (let i = 1; i < dates.length; i++) {
    const diff = new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime();
    if (diff === 86400000) streak++;
    else break;
  }
  return streak;
};

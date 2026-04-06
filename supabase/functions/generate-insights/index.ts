import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

function extractJsonFromResponse(response: string): unknown {
  let cleaned = response
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonStart = cleaned.search(/[\[\{]/);
  const lastBracket = cleaned.lastIndexOf("]");
  const lastBrace = cleaned.lastIndexOf("}");
  const jsonEnd = Math.max(lastBracket, lastBrace);

  if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON found in response");
  cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(cleaned);
  } catch {
    cleaned = cleaned.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]").replace(/[\x00-\x1F\x7F]/g, "");
    return JSON.parse(cleaned);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, serviceKey);

    // Auth
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authErr } = await anonClient.auth.getUser(token);
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const weekStart = getWeekStart();
    const { force } = await req.json().catch(() => ({ force: false }));

    // Check existing insights (unless force refresh)
    if (!force) {
      const { data: existing } = await supabase
        .from("weekly_insights")
        .select("insights")
        .eq("user_id", user.id)
        .eq("week_start", weekStart)
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ insights: existing.insights, cached: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fetch last 7 days of data
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [sessionsRes, sleepRes, profileRes] = await Promise.all([
      supabase
        .from("sessions")
        .select("mode, duration, target_duration, mood_pre, mood_post, created_at")
        .eq("user_id", user.id)
        .gte("created_at", sevenDaysAgo)
        .order("created_at", { ascending: false }),
      supabase
        .from("sleep_logs")
        .select("bedtime, waketime, quality, created_at")
        .eq("user_id", user.id)
        .gte("created_at", sevenDaysAgo)
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("goal, stress_level")
        .eq("id", user.id)
        .single(),
    ]);

    const sessions = sessionsRes.data || [];
    const sleepLogs = sleepRes.data || [];
    const profile = profileRes.data;

    // Calculate streak
    const allSessionDates = sessions.map((s: any) =>
      new Date(s.created_at).toISOString().split("T")[0]
    );
    const uniqueDays = [...new Set(allSessionDates)].sort().reverse();
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      if (uniqueDays.includes(ds)) streak++;
      else if (i > 0) break;
    }

    const prompt = `You are a gentle, encouraging wellness coach for Sonus — a sound therapy app. 
Analyze this user's past 7 days and return EXACTLY 4 insights as a JSON array.

User profile: goal="${profile?.goal || "unknown"}", stress="${profile?.stress_level || "unknown"}"
Current streak: ${streak} days

Sessions (${sessions.length} total):
${JSON.stringify(sessions.slice(0, 20))}

Sleep logs (${sleepLogs.length} total):
${JSON.stringify(sleepLogs.slice(0, 10))}

Return EXACTLY this JSON format — an array of 4 objects:
[
  {"emoji": "🎯", "title": "Short Title", "text": "1-2 sentence insight."},
  {"emoji": "😴", "title": "Short Title", "text": "1-2 sentence insight."},
  {"emoji": "🎵", "title": "Short Title", "text": "1-2 sentence insight."},
  {"emoji": "💡", "title": "Short Title", "text": "1-2 sentence insight."}
]

The 4 insights must cover:
1. Emotional improvement patterns (mood_pre vs mood_post trends)
2. Sleep and session correlation
3. Which session mode worked best
4. One practical suggestion for next week

Be warm, specific, and reference actual data. If data is sparse, be encouraging about building habits. Return ONLY the JSON array, no other text.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("Empty AI response");

    const insights = extractJsonFromResponse(rawContent);

    // Validate structure
    if (!Array.isArray(insights) || insights.length !== 4) {
      throw new Error("Invalid insights format");
    }

    // Upsert
    await supabase
      .from("weekly_insights")
      .upsert(
        { user_id: user.id, week_start: weekStart, insights },
        { onConflict: "user_id,week_start" }
      );

    return new Response(JSON.stringify({ insights, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-insights error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

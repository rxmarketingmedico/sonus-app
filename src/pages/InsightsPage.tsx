import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Insight {
  emoji: string;
  title: string;
  text: string;
}

const InsightsPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInsights = async (force = false) => {
    if (!user) return;

    if (force) setRefreshing(true);
    else setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-insights", {
        body: { force },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.insights && Array.isArray(data.insights)) {
        setInsights(data.insights);
      }
    } catch (err: any) {
      console.error("Insights error:", err);
      toast.error(t("insights.error"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [user]);

  return (
    <div className="min-h-screen pb-24 md:pb-8 px-4 pt-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-sonus-purple" />
            <h1 className="font-display text-2xl font-bold text-foreground">
              {t("insights.title")}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchInsights(true)}
            disabled={refreshing || loading}
            className="border-border/50"
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-1" />
            )}
            {t("insights.refresh")}
          </Button>
        </div>

        <p className="text-muted-foreground text-sm mb-8">
          {t("insights.desc")}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card/50 border border-border/50 rounded-2xl p-6 animate-pulse"
                >
                  <div className="w-12 h-12 bg-sonus-purple/10 rounded-xl mb-4" />
                  <div className="h-5 bg-muted/30 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted/20 rounded w-full mb-2" />
                  <div className="h-4 bg-muted/20 rounded w-5/6" />
                </div>
              ))
            : insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-card/50 border border-border/50 rounded-2xl p-6 hover:border-sonus-purple/30 transition-colors"
                >
                  <span className="text-4xl block mb-3">{insight.emoji}</span>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.text}
                  </p>
                </motion.div>
              ))}
        </div>

        {!loading && insights.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{t("insights.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;

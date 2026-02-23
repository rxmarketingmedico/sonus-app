import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Home, LayoutDashboard, Music, User, CreditCard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { path: "/", icon: Home, key: "nav.home" as const },
  { path: "/dashboard", icon: LayoutDashboard, key: "nav.dashboard" as const },
  { path: "/session", icon: Music, key: "nav.session" as const },
  { path: "/profile", icon: User, key: "nav.profile" as const },
  { path: "/plans", icon: CreditCard, key: "nav.plans" as const },
];

const AppNavigation = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Hide nav on session/feedback/onboarding
  const hiddenPaths = ["/session", "/feedback", "/onboarding"];
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) return null;

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/50 z-50">
        <div className="flex justify-around py-2 px-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors ${
                  active ? "text-sonus-purple" : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px]">{t(item.key)}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-16 bg-card/80 backdrop-blur-xl border-r border-border/50 z-50 flex flex-col items-center py-6 gap-4">
      <div className="w-8 h-8 rounded-full gradient-primary mb-4" />
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              active ? "bg-sonus-purple/20 text-sonus-purple" : "text-muted-foreground hover:text-foreground"
            }`}
            title={t(item.key)}
          >
            <item.icon className="w-5 h-5" />
          </button>
        );
      })}
    </nav>
  );
};

export default AppNavigation;

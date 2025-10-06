import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom"; // ADD useLocation
import { createPageUrl } from "./utils";
import { User } from "./Entities/User";
import { Home, Activity, BookOpen, Clock, Settings, Mic } from "lucide-react";

export default function Layout({ currentPageName }) {
  const [user, setUser] = useState(null);
  const [isRTL, setIsRTL] = useState(false);
  const location = useLocation(); // ADD this hook

  // Function to get current page from URL path
  const getCurrentPageFromPath = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/exercises') return 'Exercises';
    if (path === '/checkin-form') return 'checkin-form';
    if (path === '/journal') return 'Journal';
    if (path === '/settings') return 'Settings';
    if (path === '/emergency') return 'Emergency';
    if (path === '/voice-check-in') return 'VoiceCheckIn';
    if (path === '/health-history') return 'HealthHistory';
    if (path === '/checkin') return 'checkin';
    return 'Home';
  };

  const currentPage = getCurrentPageFromPath();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setIsRTL(userData.language_preference === "ar");
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  // Skip layout for onboarding page
  if (currentPageName === "Onboarding") {
    return <Outlet />;
  }

  const navItems = [
    { name: "Home", nameAr: "الرئيسية", icon: Home, page: "Home" },
    { name: "Exercises", nameAr: "التمارين", icon: Activity, page: "Exercises" },
    { name: "Check-In", nameAr: "التسجيل اليومي", icon: Clock, page: "checkin-form", isCenter: true },
    { name: "Journal", nameAr: "اليوميات", icon: BookOpen, page: "Journal" },
    { name: "Settings", nameAr: "الإعدادات", icon: Settings, page: "Settings" },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <style>{`
        :root {
          --primary: #00A29D;
          --primary-100: rgba(0,162,157,0.20);
          --primary-200: rgba(0,162,157,0.40);
          --primary-300: rgba(0,162,157,0.60);
          --primary-400: rgba(0,162,157,0.80);
          --accent: #FFCC66;
          --accent-30: rgba(255,204,102,0.30);
          --bg: #FFFFFF;
          --surface: #F7F9F8;
          --muted-text: #666666;
          --strong-text: #0B2B2B;
          --error: #D9534F;
          --success: #2E7D32;
        }
        body {
          background-color: var(--bg);
          color: var(--strong-text);
          margin: 0;
          padding: 0;
        }
        * {
          transition: background-color 0.3s ease, color 0.3s ease;
        }
      `}</style>

      {/* Main Content */}
      <div className="pb-24">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 shadow-lg"
        style={{ backgroundColor: "white", borderTop: "1px solid var(--primary-200)" }}
      >
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-around h-20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page; // CHANGED: currentPageName → currentPage

              if (item.isCenter) {
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className="flex flex-col items-center justify-center -mt-8"
                    aria-label={isRTL ? item.nameAr : item.name}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                      style={{
                        backgroundColor: "var(--primary)",
                        transform: isActive ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      <Icon className="w-8 h-8" style={{ color: "white" }} />
                    </div>
                    <span
                      className="text-xs mt-2 font-medium"
                      style={{ color: isActive ? "var(--primary)" : "var(--muted-text)" }}
                    >
                      {isRTL ? item.nameAr : item.name}
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className="flex flex-col items-center justify-center py-2 px-3 min-w-[60px]"
                  aria-label={isRTL ? item.nameAr : item.name}
                >
                  <Icon
                    className="w-6 h-6 mb-1"
                    style={{
                      color: isActive ? "var(--primary)" : "var(--muted-text)",
                      strokeWidth: isActive ? 2.5 : 2,
                    }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: isActive ? "var(--primary)" : "var(--muted-text)" }}
                  >
                    {isRTL ? item.nameAr : item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
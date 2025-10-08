import React, { useState, useEffect } from "react";
import SpeechRecognitionPopup from "./components/SpeechRecognitionPopup";
import { Outlet, Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { User } from "./Entities/User";
import { Home, Activity, BookOpen, Settings, Mic } from "lucide-react";

export default function Layout() {
  const [showSpeechPopup, setShowSpeechPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [isRTL, setIsRTL] = useState(false);
  const location = useLocation();

  const getCurrentPageFromPath = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/exercises') return 'Exercises';
    if (path === '/check-in-form') return 'CheckInForm';
    if (path === '/check-in') return 'CheckIn';
    if (path === '/journal') return 'Journal';
    if (path === '/settings') return 'Settings';
    if (path === '/emergency') return 'Emergency';
    if (path === '/voice-check-in') return 'VoiceCheckIn';
    if (path === '/health-history') return 'HealthHistory';
    if (path === '/patientReport') return 'PatientReport';
    if (path === '/BookAppointment') return 'BookAppointment';
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

  const navItems = [
    { name: "Home", nameAr: "الرئيسية", icon: Home, page: "Home" },
    { name: "Exercises", nameAr: "التمارين", icon: Activity, page: "Exercises" },
    { name: "Voice", nameAr: "الصوت", icon: Mic, page: "SpeechRecognition", isCenter: true },
    { name: "Journal", nameAr: "اليوميات", icon: BookOpen, page: "Journal" },
    { name: "Settings", nameAr: "الإعدادات", icon: Settings, page: "Settings" },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <style>{`
        :root {
          --primary: #3AB4B4;
          --primary-50: #51c6c6d7;
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
          --errorMic: #cd7e7cff;
          --success: #2E7D32;
          --gradient: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%);
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
              const isActive = currentPage === item.page;

              if (item.isCenter) {
                return (
                  <button
                    key={item.page}
                    type="button"
                    className="flex flex-col items-center justify-center -mt-8 bg-transparent border-none outline-none"
                    aria-label={isRTL ? item.nameAr : item.name}
                    onClick={() => setShowSpeechPopup(true)}
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
                  </button>
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
      {showSpeechPopup && (
        <SpeechRecognitionPopup onClose={() => setShowSpeechPopup(false)} />
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useAccessibility } from "../Entities/AccessibilityContext";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../components";
import { ChevronRight, Mic, Bell, Heart, Type } from "lucide-react";
export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [accessibilityPreset, setAccessibilityPreset] = useState("standard");
  const [user, setUser] = useState(null);
  const { language, setLanguage } = useAccessibility();

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setAccessibilityPreset(userData.accessibility_preset || "standard");
      // If already completed onboarding, redirect to home
      if (userData.onboarding_completed) {
        navigate(createPageUrl("Home"));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleComplete = async () => {
    try {
      if (!user) return;
      await User.update(user.id, {
        language_preference: language,
        accessibility_preset: accessibilityPreset,
        onboarding_completed: true
      });
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  const slides = [
    {
      icon: Heart,
      title: "Welcome to Jusoor",
      titleAr: "مرحباً بك في جسور",
      description: "Your personal MS wellness companion, designed with care for your daily journey",
      descriptionAr: "رفيقك الشخصي لصحة التصلب المتعدد، مصمم بعناية لرحلتك اليومية",
      color: "var(--primary)"
    },
    {
      icon: Mic,
      title: "Voice-First Experience",
      titleAr: "تجربة صوتية أولاً",
      description: "Use your voice for quick check-ins, journaling, and exercise guidance",
      descriptionAr: "استخدم صوتك لتسجيل الدخول السريع والتدوين وإرشادات التمارين",
      color: "var(--accent)"
    },
    {
      icon: Bell,
      title: "Permissions & Setup",
      titleAr: "الأذونات والإعداد",
      description: "We'll need access to microphone, notifications, and health data to serve you better",
      descriptionAr: "سنحتاج إلى الوصول إلى الميكروفون والإشعارات والبيانات الصحية لخدمتك بشكل أفضل",
      color: "var(--primary-300)"
    }
  ];

  const currentSlide = slides[step];
  const Icon = currentSlide?.icon;
  const isRTL = language === "ar";
  const t = (en, ar) => (isRTL ? ar : en);

  if (step === 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" dir={isRTL ? "rtl" : "ltr"}>
        <style>{`
          :root {
            --primary: #00A29D;
            --primary-100: rgba(0,162,157,0.20);
            --primary-200: rgba(0,162,157,0.40);
            --strong-text: #0B2B2B;
            --muted-text: #666666;
          }
        `}</style>
        
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <Type className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--primary)" }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--strong-text)" }}>
              {t("Choose Your Preferences", "اختر تفضيلاتك")}
            </h2>
          </div>

          {/* Language Selection */}
          <div>
            <p className="text-sm font-medium mb-3" style={{ color: "var(--muted-text)" }}>
              {t("Language", "اللغة")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setLanguage("en")}
                className="flex-1 p-4 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: language === "en" ? "var(--primary-100)" : "white",
                  border: language === "en" ? "2px solid var(--primary)" : "2px solid var(--primary-200)"
                }}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("ar")}
                className="flex-1 p-4 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: language === "ar" ? "var(--primary-100)" : "white",
                  border: language === "ar" ? "2px solid var(--primary)" : "2px solid var(--primary-200)"
                }}
              >
                عربي
              </button>
            </div>
          </div>

          {/* Accessibility Preset */}
          <div>
            <p className="text-sm font-medium mb-3" style={{ color: "var(--muted-text)" }}>
              {t("Accessibility", "إمكانية الوصول")}
            </p>
            <div className="space-y-2">
              {[
                { value: "standard", label: "Standard", labelAr: "قياسي" },
                { value: "large_text", label: "Large Text", labelAr: "نص كبير" },
                { value: "low_effort", label: "Low Effort Mode", labelAr: "وضع جهد منخفض" }
              ].map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setAccessibilityPreset(preset.value)}
                  className="w-full p-4 rounded-xl text-left transition-all"
                  style={{
                    backgroundColor: accessibilityPreset === preset.value ? "var(--primary-100)" : "white",
                    border: accessibilityPreset === preset.value ? "2px solid var(--primary)" : "2px solid var(--primary-200)"
                  }}
                >
                  {t(preset.label, preset.labelAr)}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleComplete}
            className="w-full h-14 text-lg font-semibold rounded-xl"
            style={{ backgroundColor: "var(--primary)", color: "white" }}
          >
            {t("Get Started", "ابدأ")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6" dir={isRTL ? "rtl" : "ltr"}>
      <style>{`
        :root {
          --primary: #00A29D;
          --primary-100: rgba(0,162,157,0.20);
          --primary-200: rgba(0,162,157,0.40);
          --strong-text: #0B2B2B;
          --muted-text: #666666;
        }
      `}</style>
      
      {/* Skip Button */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => setStep(3)}
          className="text-sm font-medium"
          style={{ color: "var(--muted-text)" }}
        >
          {isRTL ? "تخطي" : "Skip"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center mb-8"
          style={{ backgroundColor: `${currentSlide.color}20` }}
        >
          <Icon className="w-16 h-16" style={{ color: currentSlide.color }} />
        </div>

        <h2 className="text-3xl font-bold text-center mb-4" style={{ color: "var(--strong-text)" }}>
          {isRTL ? currentSlide.titleAr : currentSlide.title}
        </h2>

        <p className="text-center text-lg" style={{ color: "var(--muted-text)" }}>
          {isRTL ? currentSlide.descriptionAr : currentSlide.description}
        </p>
      </div>

      {/* Navigation */}
      <div className="w-full max-w-md space-y-4">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className="h-2 rounded-full transition-all"
              style={{
                width: index === step ? "24px" : "8px",
                backgroundColor: index === step ? "var(--primary)" : "var(--primary-200)"
              }}
            />
          ))}
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-4" style={{ color: "var(--strong-text)" }}>
          {isRTL ? currentSlide.titleAr : currentSlide.title}
        </h2>

        <p className="text-center text-lg" style={{ color: "var(--muted-text)" }}>
          {isRTL ? currentSlide.descriptionAr : currentSlide.description}
        </p>
      </div>

      {/* Navigation */}
      <div className="w-full max-w-md space-y-4">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className="h-2 rounded-full transition-all"
              style={{
                width: index === step ? "24px" : "8px",
                backgroundColor: index === step ? "var(--primary)" : "var(--primary-200)"
              }}
            />
          ))}
        </div>

        <Button
          onClick={() => setStep(step + 1)}
          className="w-full h-14 text-lg font-semibold rounded-xl"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
        >
          {isRTL ? "التالي" : "Next"}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
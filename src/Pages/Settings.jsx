
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Type, Zap, MapPin, LogOut, User as UserIcon } from "lucide-react";
import { User } from "../Entities/User";
import { Switch, Button } from "../components";
import { useAccessibility } from "../Entities/AccessibilityContext"; 

export default function AccessibilitySettings() {
  const { fontSize, setFontSize, lineHeight, setLineHeight, letterSpacing, setLetterSpacing, bold, setBold } = useAccessibility();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    language_preference: "en",
    accessibility_preset: "standard",
    health_sync_enabled: false,
    emergency_location_enabled: false,
  });

  
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setSettings({
        language_preference: userData.language_preference || "en",
        accessibility_preset: userData.accessibility_preset || "standard",
        health_sync_enabled: userData.health_sync_enabled || false,
        emergency_location_enabled: userData.emergency_location_enabled || false,
      });
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  
  const handleSave = async () => {
    try {
      await User.update(user.id, settings);
      alert(settings.language_preference === "ar" ? "تم الحفظ" : "Settings saved");
      window.location.reload();
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.reload(); // Will redirect to built-in login
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isRTL = settings.language_preference === "ar";

  return (
    <div className="min-h-screen p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--strong-text)" }}>
            {isRTL ? "الإعدادات" : "Settings"}
          </h1>
          <p style={{ color: "var(--muted-text)" }}>
            {isRTL ? "إدارة تفضيلاتك" : "Manage your preferences"}
          </p>
        </div>

        {/* Profile Section */}
        <div
          className="p-6 rounded-2xl"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--primary-100)" }}
            >
              <UserIcon className="w-8 h-8" style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <h3 className="font-semibold text-lg" style={{ color: "var(--strong-text)" }}>
                {user?.full_name}
              </h3>
              <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Language */}
        <div
          className="p-6 rounded-2xl"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5" style={{ color: "var(--primary)" }} />
            <h3 className="font-semibold" style={{ color: "var(--strong-text)" }}>
              {isRTL ? "اللغة" : "Language"}
            </h3>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSettings({ ...settings, language_preference: "en" })}
              className="flex-1 p-4 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: settings.language_preference === "en" ? "var(--primary-100)" : "white",
                border: settings.language_preference === "en" ? "2px solid var(--primary)" : "2px solid var(--primary-200)",
                color: "var(--strong-text)",
              }}
            >
              English
            </button>
            <button
              onClick={() => setSettings({ ...settings, language_preference: "ar" })}
              className="flex-1 p-4 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: settings.language_preference === "ar" ? "var(--primary-100)" : "white",
                border: settings.language_preference === "ar" ? "2px solid var(--primary)" : "2px solid var(--primary-200)",
                color: "var(--strong-text)",
              }}
            >
              عربي
            </button>
          </div>
        </div>

        {/* Accessibility */}
     
        <div
          className="p-6 rounded-2xl"
          style={{ backgroundColor: "var(--surface)" }}
        >
          
          <div className="flex items-center gap-3 mb-4">
            <Type className="w-5 h-5" style={{ color: "var(--primary)" }} />
            <h3 className="font-semibold" style={{ color: "var(--strong-text)" }}>
              {isRTL ? "إمكانية الوصول" : "Accessibility"}
            </h3>
          </div>
           {/* Custom Accessibility Buttons */}
<div className="space-y-2">
  <button
    onClick={() => setFontSize(prev => prev + 2)}
    className="w-full p-4 rounded-xl text-left transition-all"
    style={{
      backgroundColor: "white",
      border: "2px solid var(--primary-200)",
    }}
  >
    <span style={{ color: "var(--strong-text)" }}>
      {isRTL ? "تكبير حجم الخط" : "Increase Font Size"} ({fontSize}px)
    </span>
  </button>

  <button
    onClick={() => setFontSize(prev => Math.max(prev - 2, 12))}
    className="w-full p-4 rounded-xl text-left transition-all"
    style={{
      backgroundColor: "white",
      border: "2px solid var(--primary-200)",
    }}
  >
    <span style={{ color: "var(--strong-text)" }}>
      {isRTL ? "تصغير حجم الخط" : "Decrease Font Size"} ({fontSize}px)
    </span>
  </button>

  <button
    onClick={() => setLineHeight(prev => prev + 0.2)}
    className="w-full p-4 rounded-xl text-left transition-all"
    style={{
      backgroundColor: "white",
      border: "2px solid var(--primary-200)",
    }}
  >
    <span style={{ color: "var(--strong-text)" }}>
      {isRTL ? "زيادة ارتفاع السطر" : "Increase Line Height"} ({lineHeight.toFixed(1)})
    </span>
  </button>

  <button
    onClick={() => setLetterSpacing(prev => prev + 0.5)}
    className="w-full p-4 rounded-xl text-left transition-all"
    style={{
      backgroundColor: "white",
      border: "2px solid var(--primary-200)",
    }}
  >
    <span style={{ color: "var(--strong-text)" }}>
      {isRTL ? "زيادة تباعد الحروف" : "Increase Letter Spacing"} ({letterSpacing}px)
    </span>
  </button>

  <button
    onClick={() => setBold(prev => !prev)}
    className="w-full p-4 rounded-xl text-left transition-all"
    style={{
      backgroundColor: "white",
      border: "2px solid var(--primary-200)",
    }}
  >
    <span style={{ color: "var(--strong-text)" }}>
      {bold
        ? isRTL
          ? "نص عادي"
          : "Normal Text"
        : isRTL
        ? "نص غامق"
        : "Bold Text"}
    </span>
  </button>
</div>
        </div>

        {/* Toggles */}
        <div
          className="p-6 rounded-2xl space-y-4"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <div>
                <p className="font-medium" style={{ color: "var(--strong-text)" }}>
                  {isRTL ? "مزامنة بيانات الصحة" : "Health Data Sync"}
                </p>
                <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                  {isRTL ? "من HealthKit أو Google Fit" : "From HealthKit or Google Fit"}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.health_sync_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, health_sync_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <div>
                <p className="font-medium" style={{ color: "var(--strong-text)" }}>
                  {isRTL ? "موقع الطوارئ" : "Emergency Location"}
                </p>
                <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                  {isRTL ? "مشاركة الموقع عند SOS" : "Share location during SOS"}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.emergency_location_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, emergency_location_enabled: checked })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            className="w-full h-14 rounded-xl text-lg font-semibold"
            style={{
              backgroundColor: "var(--success)",
              color: "white",
            }}
          >
            {isRTL ? "حفظ التغييرات" : "Save Changes"}
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-14 rounded-xl text-lg font-semibold"
            style={{
              borderColor: "var(--error)",
              color: "var(--error)",
            }}
          >
            <LogOut className="w-5 h-5 mr-2" />
            {isRTL ? "تسجيل الخروج" : "Logout"}
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center pt-6" style={{ color: "var(--muted-text)" }}>
          <p className="text-sm">Jusoor MS Companion v1.0</p>
          <p className="text-xs mt-1">
            {isRTL ? "مع الحب لمرضى التصلب المتعدد 🦋" : "Made with love for MS patients 🦋"}
          </p>
        </div>
      </div>
    </div>
  );
}

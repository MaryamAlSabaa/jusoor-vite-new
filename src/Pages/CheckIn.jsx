import React, { useState, useEffect } from "react";
import { Card, Button } from "../components";
import { User } from "../Entities/User";
import { checkIn } from "../Entities/CheckIn";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { BookOpen } from "lucide-react";

export default function CheckIn() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isRTL, setIsRTL] = useState(false);
  const [todayCheckIn, setTodayCheckIn] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
  try {
    const userData = await User.me();
    setUser(userData);
    setIsRTL(userData.language_preference === "ar");

    const today = format(new Date(), "yyyy-MM-dd");

    // Check in localStorage
    const localCheckIn = localStorage.getItem("currentCheckIn");
    if (localCheckIn) {
      const parsed = JSON.parse(localCheckIn);
      if (parsed.check_in_date === today && parsed.created_by === userData.email) {
        setTodayCheckIn(parsed);
        return;
      }
    }

    // Otherwise look up ALL check-ins but filter to today's
    const checkIns = await checkIn.list();
    const todayCheck = checkIns.find(
      c => c.check_in_date === today && c.created_by === userData.email
    );

    setTodayCheckIn(todayCheck || null);
  } catch (error) {
    console.error("Error loading user:", error);
  }
};


  const t = (en, ar) => (isRTL ? ar : en);

  return (
    <div className="min-h-screen p-6 pb-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--strong-text)" }}>
            {t("Daily Check-In", "التسجيل اليومي")}
          </h1>
          <p style={{ color: "var(--muted-text)" }}>
            {t("Complete your daily check-in to access personalized exercises", "أكمل تسجيلك اليومي للوصول إلى التمارين المخصصة")}
          </p>
        </div>

        {/* Manual Check-In Card */}
        <Card className="p-6" style={{ backgroundColor: "var(--surface)" }}>
          <div 
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate("/check-in-form")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--primary-100)" }}>
                  <BookOpen className="w-6 h-6" style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: "var(--strong-text)" }}>
                    {t("Daily Check-In", "التسجيل اليومي")}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                    {t("Fill out detailed form with fatigue, mood, symptoms", "املأ نموذج مفصل بالإرهاق، المزاج، والأعراض")}
                  </p>
                </div>
              </div>
              <div className="w-6 h-6 flex items-center justify-center">
                <span style={{ color: "var(--muted-text)", fontSize: "1.5rem" }}>→</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Start Check-In Button */}
        <Button
          onClick={() => navigate("/check-in-form")}
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
            fontWeight: 600,
            borderRadius: 12,
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            width: "100%"
          }}
        >
          {t("Start Daily Check-In", "بدء التسجيل اليومي")}
        </Button>

        {/* Today's Status */}
        {todayCheckIn ? (
          <Card className="p-6" style={{ backgroundColor: "var(--primary-100)" }}>
            <div className="text-center">
              <h3 className="font-semibold mb-2" style={{ color: "var(--strong-text)" }}>
                {t("Today's Check-In Complete", "تم التسجيل اليوم")}
              </h3>
              <p style={{ color: "var(--muted-text)" }}>
                {t("Fatigue", "الإرهاق")}: {todayCheckIn.fatigue_level}/10 • 
                {t("Mood", "المزاج")}: {todayCheckIn.mood === "very_happy" && "😊"}
                {todayCheckIn.mood === "happy" && "🙂"}
                {todayCheckIn.mood === "neutral" && "😐"}
                {todayCheckIn.mood === "sad" && "😔"}
                {todayCheckIn.mood === "very_sad" && "😢"}
              </p>
              <Button
                variant="ghost"
                className="mt-3"
                style={{ color: "var(--primary)" }}
                onClick={() => navigate("/check-in-form")}
              >
                {t("Update Check-In", "تحديث التسجيل")}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 text-center" style={{ backgroundColor: "var(--accent-30)", borderColor: "var(--accent)" }}>
            <p className="font-medium" style={{ color: "var(--strong-text)" }}>
              {t("You haven't checked in today yet", "لم تسجل دخولك اليوم بعد")}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--muted-text)" }}>
              {t("Complete your check-in to access personalized exercises", "أكمل تسجيلك للوصول إلى التمارين المخصصة")}
            </p>
          </Card>
        )}

        {/* Quick Stats */}
        <Card className="p-6" style={{ backgroundColor: "var(--surface)" }}>
          <h3 className="font-semibold mb-4" style={{ color: "var(--strong-text)" }}>
            {t("Why Daily Check-In?", "لماذا التسجيل اليومي؟")}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: "var(--primary-100)" }}>
                <span style={{ color: "var(--primary)" }}>📊</span>
              </div>
              <p className="text-xs" style={{ color: "var(--muted-text)" }}>
                {t("Track Progress", "تتبع التقدم")}
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: "var(--primary-100)" }}>
                <span style={{ color: "var(--primary)" }}>🎯</span>
              </div>
              <p className="text-xs" style={{ color: "var(--muted-text)" }}>
                {t("Personalized Insights", "رؤى مخصصة")}
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: "var(--primary-100)" }}>
                <span style={{ color: "var(--primary)" }}>🩺</span>
              </div>
              <p className="text-xs" style={{ color: "var(--muted-text)" }}>
                {t("Doctor Reports", "تقارير الطبيب")}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
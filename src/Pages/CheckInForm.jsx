import React, { useState, useEffect } from "react";
import { useAccessibility } from "../Entities/AccessibilityContext";
import { Card, Button } from "../components";
import { createPageUrl } from "../utils";
import { User } from "../Entities/User";
import { checkIn } from "../Entities/CheckIn";
import { useNavigate } from "react-router-dom";
export default function CheckInForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [fatigue, setFatigue] = useState(null);
  const [mood, setMood] = useState(null);
  const [mobility, setMobility] = useState(null);
  const [symptoms, setSymptoms] = useState(new Set());
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { language, isRTL } = useAccessibility();

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
      // Use fallback user data
      setUser({ full_name: "Test User", email: "test@example.com", language_preference: "en" });
    }
  };


  const t = (en, ar) => (isRTL ? ar : en);

  const moods = [
    { key: "very_happy", emoji: "😄", en: "Very Happy", ar: "سعيد جدًا" },
    { key: "happy", emoji: "🙂", en: "Happy", ar: "سعيد" },
    { key: "neutral", emoji: "😐", en: "Neutral", ar: "محايد" },
    { key: "sad", emoji: "😔", en: "Sad", ar: "حزين" },
    { key: "very_sad", emoji: "😢", en: "Very Sad", ar: "حزين جدًا" },
  ];

  const symptomOptions = [
    t("Numbness", "خدر"),
    t("Weakness", "ضعف"),
    t("Vision Issues", "مشاكل في الرؤية"),
    t("Balance Problems", "مشاكل التوازن"),
    t("Memory Fog", "تشوش الذاكرة"),
    t("Tingling", "تنميل"),
    t("Spasticity", "تشنج"),
    t("Dizziness", "دوار"),
    t("Heat Sensitivity", "حساسية للحرارة"),
    t("Bladder Issues", "مشاكل المثانة"),
    t("Bowel Issues", "مشاكل الأمعاء"),
  ];

  const toggleSymptom = (s) => {
    const next = new Set(symptoms);
    next.has(s) ? next.delete(s) : next.add(s);
    setSymptoms(next);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // validation
    if (!fatigue) return setError(t("Please select fatigue.", "يرجى اختيار مستوى الإرهاق"));
    if (!mood) return setError(t("Please select your mood.", "يرجى اختيار حالتك المزاجية."));
    if (!mobility) return setError(t("Please select mobility.", "يرجى اختيار القدرة الحركية"));

    const payload = {
      check_in_date: format(new Date(), "yyyy-MM-dd"),
      created_by: user?.email || "test@example.com",
      fatigue_level: fatigue,
      mood: mood,
      mobility_level: mobility,
      symptoms: Array.from(symptoms),
      notes: notes?.trim() || null,
      pain_level: 0
    };

    try {
      setSubmitting(true);
      console.log("💾 SAVING CHECK-IN:", payload);

      // Force save to localStorage FIRST
      const result = {
        id: Date.now(),
        ...payload,
        created_at: new Date().toISOString()
      };
      
      // Save directly to localStorage
      localStorage.setItem("currentCheckIn", JSON.stringify(result));
      console.log("✅ DIRECT SAVE to localStorage:", result);
      
      // Also save via checkIn entity for compatibility
      if (checkIn?.create) {
        await checkIn.create(payload);
      }
      
      // Wait a moment to ensure save completes
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Force reload of Exercises page
      window.location.href = '/exercises';
      
    } catch (err) {
      console.error("❌ Error saving check-in:", err);
      setError(t("Something went wrong. Please try again.", "حدث خطأ ما. يرجى المحاولة مرة أخرى."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pb-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 rounded-2xl" style={{ border: "1px solid var(--primary-200)" }}>
          <Button onClick={() => navigate("/")} variant="ghost" style={{ color: "var(--primary)" }}>
            ← {t("Back to Home", "العودة للرئيسية")}
          </Button>
          <h1 className="text-2xl font-bold text-[var(--strong-text)]">{t("Daily Check-In", "التسجيل اليومي")}</h1>
          <p className="mt-1 text-[var(--muted-text)]">{t("How are you feeling today?", "كيف تشعر اليوم؟")}</p>
        </Card>

        {/* Fatigue */}
        <Card className="p-5 rounded-2xl" style={{ backgroundColor: "var(--surface)" }}>
          <h2 className="text-xl font-semibold text-[var(--strong-text)] mb-4">{t("Fatigue", "الإرهاق (١–١٠)")}</h2>
          <div className="grid grid-cols-10 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setFatigue(n)}
                className={`h-10 rounded-md border text-sm font-semibold transition ${
                  fatigue === n
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--strong-text)] border-gray-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-sm text-[var(--muted-text)] mt-2">
            <span>{t("High Energy", "طاقة عالية")}</span>
            <span>{t("Very Tired", "مرهق جدًا")}</span>
          </div>
        </Card>

        {/* Mood */}
        <Card className="p-5 rounded-2xl" style={{ backgroundColor: "var(--surface)" }}>
          <h2 className="text-xl font-semibold text-[var(--strong-text)] mb-4">{t("Mood", "المزاج")}</h2>
          <div className="grid grid-cols-5 gap-4 text-center">
            {moods.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMood(m.key)}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition mx-auto ${
                  mood === m.key
                    ? "ring-2 ring-[var(--primary)] border-[var(--primary)] bg-white"
                    : "border-gray-300 bg-white"
                }`}
                title={t(m.en, m.ar)}
              >
                <span className="text-2xl">{m.emoji}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Mobility */}
        <Card className="p-5 rounded-2xl" style={{ backgroundColor: "var(--surface)" }}>
          <h2 className="text-xl font-semibold text-[var(--strong-text)] mb-4">{t("Mobility", "القدرة الحركية (١–٥)")}</h2>
          <div className="grid grid-cols-5 gap-4 text-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMobility(n)}
                className={`w-full h-12 rounded-md border text-sm font-semibold transition ${
                  mobility === n
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--strong-text)] border-gray-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-sm text-[var(--muted-text)] mt-2">
            <span>{t("Difficult", "صعب")}</span>
            <span>{t("Excellent", "ممتاز")}</span>
          </div>
        </Card>

        {/* Symptoms */}
        <Card className="p-5 rounded-2xl" style={{ backgroundColor: "var(--surface)" }}>
          <h2 className="text-xl font-semibold text-[var(--strong-text)] mb-3">{t("Symptoms", "الأعراض")}</h2>
          <div className="flex flex-wrap gap-3">
            {symptomOptions.map((s) => {
              const active = symptoms.has(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    active
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-white text-[var(--strong-text)] border-gray-300"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Notes */}
        <Card className="p-5 rounded-2xl" style={{ backgroundColor: "var(--surface)" }}>
          <h2 className="text-xl font-semibold text-[var(--strong-text)] mb-3">{t("Additional Notes", "ملاحظات إضافية")}</h2>
          <textarea
            className="w-full rounded-lg border border-gray-300 p-3 outline-none"
            rows={4}
            placeholder={t("Any additional thoughts or observations...", "أي ملاحظات أو أفكار إضافية...")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Card>

        {/* Errors */}
        {error && (
          <div className="p-3 rounded-md text-sm" style={{ background: "#fdecea", color: "#b3261e" }}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={onSubmit}
          disabled={submitting}
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
            fontWeight: 600,
            borderRadius: 10,
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            width: "100%",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? t("Saving...", "جارٍ الحفظ...") : t("Submit Check-In & Go to Exercises", "إرسال التسجيل والذهاب للتمارين")}
        </Button>
      </div>
    </div>
  );
}
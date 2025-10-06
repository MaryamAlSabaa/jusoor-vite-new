import React, { useState, useEffect } from "react";
import { Card, Button } from "../components";
import { createPageUrl } from "../utils";
import { User } from "../Entities/User";
import { checkIn } from "../Entities/CheckIn";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Mic } from "lucide-react"; // ADDED Mic import

export default function CheckInForm() {
  const navigate = useNavigate();

  // UI / data
  const [user, setUser] = useState(null);
  const [isRTL, setIsRTL] = useState(false);

  const [fatigue, setFatigue] = useState(null);     
  const [mood, setMood] = useState(null);           
  const [mobility, setMobility] = useState(null); 
  const [symptoms, setSymptoms] = useState(new Set());
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const u = await User.me?.() ?? { full_name: "Test User", email: "test@example.com", language_preference: "en" };
        setUser(u);
        setIsRTL(u.language_preference === "ar");
      } catch {
        const u = { full_name: "Test User", email: "test@example.com", language_preference: "en" };
        setUser(u);
        setIsRTL(false);
      }
    })();
  }, []);

  const moods = [ 
    { key: "very_happy", emoji: "😄", en: "Very Happy", ar: "سعيد جدًا" }, 
    { key: "happy", emoji: "🙂", en: "Happy", ar: "سعيد" }, 
    { key: "neutral", emoji: "😐", en: "Neutral", ar: "محايد" }, 
    { key: "sad", emoji: "😔", en: "Sad", ar: "حزين" }, 
    { key: "very_sad", emoji: "😢", en: "Very Sad", ar: "حزين جدًا" }, 
  ];

  const mobilityOptions = [1, 2, 3, 4, 5];

  const symptomOptions = [
    "Numbness",
    "Weakness",
    "Vision Issues",
    "Balance Problems",
    "Memory Fog",
    "Tingling",
    "Spasticity",
    "Dizziness",
    "Heat Sensitivity",
    "Bladder Issues",
    "Bowel Issues",
  ];

  const t = (en, ar) => (isRTL ? ar : en);

  const toggleSymptom = (s) => {
    const next = new Set(symptoms);
    next.has(s) ? next.delete(s) : next.add(s);
    setSymptoms(next);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // validation
    if (!fatigue)  return setError(t("Please select fatigue.", "يرجى اختيار مستوى الإرهاق"));
    if (!mood)     return setError(t("Please select your mood.", "يرجى اختيار حالتك المزاجية."));
    if (!mobility) return setError(t("Please select mobility.", "يرجى اختيار القدرة الحركية"));

    const payload = {
      check_in_date: format(new Date(), "yyyy-MM-dd"),
      created_by: user?.id ?? user?.email ?? "test@example.com",
      fatigue_level: fatigue,
      mood,
      mobility_level: mobility,
      symptoms: Array.from(symptoms),
      notes: notes?.trim() || null,
    };

    try {
      setSubmitting(true);
      if (checkIn?.create) {
        await checkIn.create(payload);
      } else {
        console.log("Mock save CheckIn:", payload);
      }
      navigate(createPageUrl("Home"));
    } catch (err) {
      console.error(err);
      setError(t("Something went wrong. Please try again.", "حدث خطأ ما. يرجى المحاولة مرة أخرى."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pb-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with Voice Option */}
        <Card className="p-6 rounded-2xl" style={{ border: "1px solid var(--primary-200)" }}>
          <div className="flex items-center justify-between mb-3">
            <Button
              onClick={() => navigate(createPageUrl("Home"))}
              variant="ghost"
              style={{ color: "var(--primary)" }}
            >
              ← {t("Back to Home", "العودة للرئيسية")}
            </Button>
            
            {/* Voice Check-In Button in Header */}
            <Button
              onClick={() => navigate(createPageUrl("VoiceCheckIn"))}
              variant="outline"
              style={{ 
                borderColor: "var(--primary)", 
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Mic className="w-4 h-4" />
              {t("Voice Check-In", "تسجيل صوتي")}
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold text-[var(--strong-text)]">
            {t("Daily Check-In", "التسجيل اليومي")}
          </h1>
          <p className="mt-1 text-[var(--muted-text)]">
            {t("How are you feeling today?", "كيف تشعر اليوم؟")}
          </p>
        </Card>

        {/* Fatigue (1–10) */}
        <Card className="p-5 rounded-2xl" style={{ backgroundColor: "var(--surface)" }}>
          <h2 className="text-xl font-semibold text-[var(--strong-text)] mb-4">
            {t("Fatigue", "الإرهاق (١–١٠)")}
          </h2>

          {/* evenly spaced 10 buttons */}
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
              const active = fatigue === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFatigue(n)}
                  className={`h-10 rounded-md border text-sm font-semibold transition
                              ${active
                                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                : "bg-white text-[var(--strong-text)] border-gray-300"}`}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-sm text-[var(--muted-text)] mt-2">
            <span>{t("High Energy", "طاقة عالية")}</span>
            <span>{t("Very Tired", "مرهق جدًا")}</span>
          </div>
        </Card>

        {/* Mood */}
        <Card className="p-5 rounded-2xl" style={{ backgroundColor: "var(--surface)" }}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-[var(--strong-text)]">
              {t("Mood", "المزاج")}
            </h2>
          </div>

          {/* evenly spaced emojis */}
          <div className="grid grid-cols-5 gap-4 text-center">
            {moods.map((m) => {
              const active = mood === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMood(m.key)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border transition mx-auto
                              ${active
                                ? "ring-2 ring-[var(--primary)] border-[var(--primary)] bg-white"
                                : "border-gray-300 bg-white"}`}
                  title={t(m.en, m.ar)}
                >
                  <span className="text-2xl">{m.emoji}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Mobility */}
        <Card className="p-5 rounded-2xl" style={{ backgroundColor: "var(--surface)" }}>
          <h2 className="text-xl font-semibold text-[var(--strong-text)] mb-4">
            {t("Mobility", "القدرة الحركية (١–٥)")}
          </h2>

          <div className="grid grid-cols-5 gap-4 text-center">
            {mobilityOptions.map((n) => {
              const active = mobility === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMobility(n)}
                  className={`w-full h-12 rounded-md border text-sm font-semibold transition
                              ${active
                                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                : "bg-white text-[var(--strong-text)] border-gray-300"}`}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-sm text-[var(--muted-text)] mt-2">
            <span>{t("Difficult", "صعب")}</span>
            <span>{t("Excellent", "ممتاز")}</span>
          </div>
        </Card>

        {/* Symptoms (multi-select chips) */}
        <Card className="p-5 rounded-2xl" style={{ backgroundColor: "var(--surface)" }}>
          <h2 className="text-xl font-semibold text-[var(--strong-text)] mb-3">
            {t("Symptoms", "الأعراض")}
          </h2>
          <div className="flex flex-wrap gap-3">
            {symptomOptions.map((s) => {
              const active = symptoms.has(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition
                              ${active
                                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                : "bg-white text-[var(--strong-text)] border-gray-300"}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Notes */}
        <Card className="p-5 rounded-2xl" style={{ backgroundColor: "var(--surface)" }}>
          <h2 className="text-xl font-semibold text-[var(--strong-text)] mb-3">
            {t("Additional Notes", "ملاحظات إضافية")}
          </h2>
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

        {/* SINGLE SUBMIT SECTION - Fixed duplicate buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onSubmit}
            disabled={submitting}
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              fontWeight: 600,
              borderRadius: 10,
              padding: "0.75rem 1.25rem",
              opacity: submitting ? 0.7 : 1,
              flex: 2
            }}
          >
            {submitting ? t("Saving...", "جارٍ الحفظ...") : t("Submit Check-In", "إرسال التسجيل")}
          </Button>

          <Button
            onClick={() => navigate(createPageUrl("VoiceCheckIn"))}
            variant="outline"
            style={{ 
              border: "1px solid var(--primary)", 
              color: "var(--primary)",
              borderRadius: 10,
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <Mic className="w-4 h-4" />
            {t("Voice", "صوت")}
          </Button>

          <Button
            onClick={() => navigate(createPageUrl("Home"))}
            variant="ghost"
            style={{ border: "1px solid #e2e8f0", borderRadius: 10, flex: 1 }}
          >
            {t("Cancel", "إلغاء")}
          </Button>
        </div>
      </div>
    </div>
  );
}
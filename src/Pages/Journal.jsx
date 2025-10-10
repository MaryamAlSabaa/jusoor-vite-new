import React, { useState, useEffect } from "react";
import { useAccessibility } from "../Entities/AccessibilityContext";
import { Journal } from "../Entities/Journal";
import { Button, Card } from "../components";
import { Mic, BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";

import SpeechToText from "../components/SpeechToText.jsx";

import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function JournalPage() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();
  const { language, isRTL } = useAccessibility();

  useEffect(() => {
    loadData();
  }, [language]);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      // load journal entries for the user
      const journalEntries = await Journal.list();
      setEntries(journalEntries || []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: isRTL ? "ar-SA" : "en-US" });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    setNewEntry(transcript); // save the transcript only when stopped
  };

  const handleSaveEntry = async () => {
    try {
      // word analysis for emotion tagging, later on it would be replaced with AI
      const text = newEntry.toLowerCase();
      let emotion_tag = "neutral";
      if (isRTL) {
        if (text.includes("سعيد") || text.includes("تحسن") || text.includes("شكر")) emotion_tag = "hopeful";
        else if (text.includes("قلق") || text.includes("توتر")) emotion_tag = "anxious";
        else if (text.includes("حزين") || text.includes("اكتئاب")) emotion_tag = "sad";
        else if (text.includes("هدوء") || text.includes("مرتاح")) emotion_tag = "calm";
        else if (text.includes("امتنان")) emotion_tag = "grateful";
        else if (text.includes("ضغط") || text.includes("إجهاد")) emotion_tag = "stressed";
      } else {
        if (text.includes("happy") || text.includes("better") || text.includes("thank")) emotion_tag = "hopeful";
        else if (text.includes("anxiety") || text.includes("anxious") || text.includes("worry")) emotion_tag = "anxious";
        else if (text.includes("sad") || text.includes("depressed")) emotion_tag = "sad";
        else if (text.includes("calm") || text.includes("relaxed")) emotion_tag = "calm";
        else if (text.includes("grateful") || text.includes("gratitude")) emotion_tag = "grateful";
        else if (text.includes("stressed") || text.includes("stress")) emotion_tag = "stressed";
        else if (text.includes("tired") || text.includes("fatigue")) emotion_tag = "tired";
      }
      const created = await Journal.create({
        transcript: newEntry,
        entry_date: format(new Date(), "yyyy-MM-dd"),
        language: isRTL ? "ar" : "en",
        emotion_tag
      });
      setNewEntry("");
      setEntries((prev) => [created, ...prev]);
      resetTranscript(); // clearing transcript after saving and going back to initial state
      setIsRecording(false); // ensuring that recording state is reset
    } catch (error) {
      console.error("Error saving entry:", error);
    }
  };

  const handleSpeechTranscript = (transcript) => {
    setNewEntry(transcript);
  };

  const emotionColors = {
    calm: "var(--primary-100)",
    stressed: "rgba(217,83,79,0.2)",
    sad: "rgba(100,100,200,0.2)",
    hopeful: "var(--accent-30)",
    anxious: "rgba(217,83,79,0.2)",
    grateful: "var(--success)",
    neutral: "var(--surface)"
  };

  const emotionEmojis = {
    calm: "😌",
    stressed: "😰",
    tired: "😟",
    sad: "😢",
    hopeful: "🌟",
    anxious: "😟",
    grateful: "🙏",
    neutral: "😐"
  };

  // Translation dictionary for all UI strings
  const t = (en, ar) => (isRTL ? ar : en);

  return (
    <div className="min-h-screen p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--strong-text)" }}>{t("My Journal", "يومياتي")}</h1>
          <p style={{ color: "var(--muted-text)" }}>{t("Record your thoughts and feelings", "سجل أفكارك ومشاعرك")}</p>
        </div>

        {/* New Entry */}
        <Card className="p-6" style={{ backgroundColor: "var(--surface)" }}>
          {!isRecording && !newEntry && (
            <button
              onClick={handleStartRecording}
              className="w-full p-8 rounded-xl flex flex-col items-center justify-center transition-all"
              style={{ backgroundColor: "var(--primary-100)", border: `2px dashed var(--primary)` }}
            >
              <Mic className="w-12 h-12 mb-3" style={{ color: "var(--primary)" }} />
              <p className="font-medium" style={{ color: "var(--strong-text)" }}>{t("Tap to Record", "اضغط للتسجيل")}</p>
            </button>
          )}

          {isRecording && (
            <button
              onClick={handleStopRecording}
              className="w-full p-8 rounded-xl flex flex-col items-center justify-center transition-all"
              style={{ backgroundColor: "var(--error)", border: `2px dashed var(--error)` }}
            >
              <Mic className="w-12 h-12 mb-3" style={{ color: "var(--errorMic)" }} />
              <p className="font-medium" style={{ color: "var(--strong-text)" }}>{t("Listening ... Tap to Stop", "جاري التسجيل... اضغط للإيقاف")}</p>
            </button>
          )}

          {newEntry && (
            <div className="space-y-4 mt-4">
              <h3 className="font-semibold mb-3" style={{ color: "var(--primary)" }}>{t("What you said:", "ما قلته:")}</h3>
              <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--primary-100)" }}>
                <p style={{ color: "var(--strong-text)" }}>{newEntry}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveEntry}
                  className="flex-1 h-12 rounded-xl font-semibold"
                  style={{ backgroundColor: "var(--success)", color: "white" }}
                >
                  {t("Save Entry", "حفظ")}
                </Button>
                <Button
                  onClick={() => setNewEntry("")}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl font-semibold"
                  style={{ borderColor: "var(--primary-200)", color: "var(--primary)" }}
                >
                  {t("Cancel", "إلغاء")}
                </Button>
              </div>
            </div>
          )}
          <div className="mb-6">
            <SpeechToText onTranscript={handleSpeechTranscript} />
          </div>
        </Card>

        <div>
          <h3 className="font-semibold mb-4" style={{ color: "var(--strong-text)" }}>{t("Past Entries", "التسجيلات السابقة")}</h3>
          <div className="space-y-4">
            {(entries.length > 0 ? entries : [
              {
                id: "sample1",
                transcript: t("I felt much better today after doing my exercises.", "شعرت اليوم بتحسن كبير بعد ممارسة التمارين الرياضية."),
                entry_date: "2025-10-09",
                emotion_tag: "hopeful",
                title: t("Positive Experience", "تجربة إيجابية")
              },
              {
                id: "sample2",
                transcript: t("I had some anxiety about my upcoming doctor appointment.", "كان لدي بعض القلق بشأن موعد الطبيب القادم."),
                entry_date: "2025-10-08",
                emotion_tag: "anxious",
                title: t("Health Anxiety", "قلق صحي")
              }
            ]).map((entry) => (
              <Card
                key={entry.id}
                className="p-6"
                style={{ backgroundColor: emotionColors[entry.emotion_tag] || "var(--surface)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{emotionEmojis[entry.emotion_tag]}</span>
                    <span className="text-sm" style={{ color: "var(--muted-text)" }}>
                      {format(new Date(entry.entry_date), t("MMM d, yyyy", "d MM yyyy"))}
                    </span>
                  </div>
                </div>
                {entry.title && (
                  <h4 className="font-semibold mb-2" style={{ color: "var(--strong-text)" }}>{entry.title}</h4>
                )}
                <p style={{ color: "var(--strong-text)" }}>{entry.transcript}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
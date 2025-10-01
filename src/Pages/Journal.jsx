import React, { useState, useEffect } from "react";
import { Journal } from "../Entities/Journal";
import { Button, Card } from "../components";
import { Mic, BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";
import { User } from "../Entities/User";

export default function JournalPage() {
  const [user, setUser] = useState(null);
  const [isRTL, setIsRTL] = useState(false);
  const [entries, setEntries] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [newEntry, setNewEntry] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setIsRTL(userData.language_preference === "ar");

      const journalEntries = await Journal.list("-entry_date", 20);
      setEntries(journalEntries);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setNewEntry(isRTL 
        ? "اليوم كان يوماً جيداً. شعرت بمزيد من الطاقة وتمكنت من المشي في الحديقة."
        : "Today was a good day. I felt more energetic and managed to take a walk in the park.");
    }, 3000);
  };

  const handleSaveEntry = async () => {
    try {
      await Journal.create({
        transcript: newEntry,
        entry_date: format(new Date(), "yyyy-MM-dd"),
        language: isRTL ? "ar" : "en",
        emotion_tag: "hopeful"
      });
      setNewEntry("");
      loadData();
    } catch (error) {
      console.error("Error saving entry:", error);
    }
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
    sad: "😢",
    hopeful: "🌟",
    anxious: "😟",
    grateful: "🙏",
    neutral: "😐"
  };

  return (
    <div className="min-h-screen p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--strong-text)" }}>
            {isRTL ? "يومياتي" : "My Journal"}
          </h1>
          <p style={{ color: "var(--muted-text)" }}>
            {isRTL ? "سجل أفكارك ومشاعرك" : "Record your thoughts and feelings"}
          </p>
        </div>

        {/* New Entry */}
        <Card className="p-6" style={{ backgroundColor: "var(--surface)" }}>
          <h3 className="font-semibold mb-4" style={{ color: "var(--strong-text)" }}>
            {isRTL ? "تسجيل جديد" : "New Entry"}
          </h3>
          
          {!newEntry ? (
            <button
              onClick={handleStartRecording}
              disabled={isRecording}
              className="w-full p-8 rounded-xl flex flex-col items-center justify-center transition-all"
              style={{
                backgroundColor: isRecording ? "var(--error)" : "var(--primary-100)",
                border: `2px dashed ${isRecording ? "var(--error)" : "var(--primary)"}`,
              }}
            >
              <Mic className="w-12 h-12 mb-3" style={{ color: isRecording ? "var(--error)" : "var(--primary)" }} />
              <p className="font-medium" style={{ color: "var(--strong-text)" }}>
                {isRecording ? (isRTL ? "جاري التسجيل..." : "Recording...") : (isRTL ? "اضغط للتسجيل" : "Tap to Record")}
              </p>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--primary-100)" }}>
                <p style={{ color: "var(--strong-text)" }}>
                  {newEntry}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveEntry}
                  className="flex-1 h-12 rounded-xl font-semibold"
                  style={{ backgroundColor: "var(--success)", color: "white" }}
                >
                  {isRTL ? "حفظ" : "Save Entry"}
                </Button>
                <Button
                  onClick={() => setNewEntry("")}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl font-semibold"
                  style={{ borderColor: "var(--primary-200)", color: "var(--primary)" }}
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Past Entries */}
        <div>
          <h3 className="font-semibold mb-4" style={{ color: "var(--strong-text)" }}>
            {isRTL ? "التسجيلات السابقة" : "Past Entries"}
          </h3>
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="p-6"
                style={{ backgroundColor: emotionColors[entry.emotion_tag] || "var(--surface)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{emotionEmojis[entry.emotion_tag]}</span>
                    <span className="text-sm" style={{ color: "var(--muted-text)" }}>
                      {format(new Date(entry.entry_date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                {entry.title && (
                  <h4 className="font-semibold mb-2" style={{ color: "var(--strong-text)" }}>
                    {entry.title}
                  </h4>
                )}
                <p style={{ color: "var(--strong-text)" }}>
                  {entry.transcript}
                </p>
              </Card>
            ))}
          </div>

          {entries.length === 0 && (
            <Card className="p-12 text-center" style={{ backgroundColor: "var(--surface)" }}>
              <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--muted-text)" }} />
              <p style={{ color: "var(--muted-text)" }}>
                {isRTL ? "لا توجد تسجيلات بعد" : "No entries yet"}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
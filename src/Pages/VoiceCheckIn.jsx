import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { checkIn } from "../Entities/CheckIn";
import { Button, Card } from "../components";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { User } from "../Entities/User";
import { useAccessibility } from "../Entities/AccessibilityContext";


export default function VoiceCheckIn() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isRTL, language } = useAccessibility();
  const t = (en, ar) => (isRTL ? ar : en);

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
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording - in production, use Web Speech API or native recording
    setTimeout(() => {
      setIsRecording(false);
      setTranscript(isRTL 
        ? "أشعر بالتعب قليلاً اليوم، لكن مزاجي جيد. يمكنني المشي بشكل مستقل."
        : "Feeling tired but can walk.");
    }, 3000);
  };

  const handleProcessCheckIn = async () => {
    setIsProcessing(true);
    try {
      const response = await InvokeLLM({
        prompt: `You are analyzing a voice check-in from an MS patient. Extract the following information from their statement: "${transcript}"
        
        Provide:
        - fatigue_level: number 0-10 (0=no fatigue, 10=extreme fatigue)
        - mood: one of [very_sad, sad, neutral, happy, very_happy]
        - mobility: one of [independent, uses_aid, wheelchair, needs_assistance]
        - pain_level: number 0-10 (default to 0 if not mentioned)
        - notes: brief summary of their statement
        
        Be conservative and understanding. If unclear, default to moderate values.`,
        response_json_schema: {
          type: "object",
          properties: {
            fatigue_level: { type: "number" },
            mood: { type: "string" },
            mobility: { type: "string" },
            pain_level: { type: "number" },
            notes: { type: "string" }
          }
        }
      });

      await checkIn.create({
        ...response,
        check_in_date: format(new Date(), "yyyy-MM-dd")
      });

      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Error processing check-in:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--strong-text)" }}>
            {t("Voice Check-In", "تسجيل دخول صوتي")}
          </h1>
          <p style={{ color: "var(--muted-text)" }}>
            {t("Tell us how you're feeling today", "أخبرنا كيف تشعر اليوم")}
          </p>
        </div>

        {/* Recording Interface */}
        <Card className="p-12 text-center" style={{ backgroundColor: "var(--surface)" }}>
          <button
            onClick={handleStartRecording}
            disabled={isRecording || transcript || isProcessing}
            className="w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all shadow-lg"
            style={{
              backgroundColor: isRecording ? "var(--error)" : "var(--primary)",
              transform: isRecording ? "scale(1.1)" : "scale(1)"
            }}
          >
            {isRecording ? (
              <MicOff className="w-16 h-16 text-white" />
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </button>

          <p className="mt-6 text-lg font-medium" style={{ color: "var(--strong-text)" }}>
            {isRecording && t("Listening...", "جاري الاستماع...")}
            {!isRecording && !transcript && t("Tap to Speak", "اضغط للتحدث")}
            {transcript && t("Recorded", "تم التسجيل")}
          </p>
        </Card>

        {/* Transcript */}
        {transcript && (
          <Card className="p-6" style={{ backgroundColor: "var(--primary-100)" }}>
            <h3 className="font-semibold mb-3" style={{ color: "var(--primary)" }}>
              {t("What you said:", "ما قلته:")}
            </h3>
            <p style={{ color: "var(--strong-text)" }}>
              {transcript}
            </p>
          </Card>
        )}

        {/* Actions */}
        {transcript && !isProcessing && (
          <div className="space-y-3">
            <Button
              onClick={handleProcessCheckIn}
              className="w-full h-14 text-lg font-semibold rounded-xl"
              style={{ backgroundColor: "var(--success)", color: "white" }}
            >
              {t("Save Check-In", "حفظ التسجيل")}
            </Button>
            <Button
              onClick={() => setTranscript("")}
              variant="outline"
              className="w-full h-14 text-lg font-semibold rounded-xl"
              style={{ borderColor: "var(--primary-200)", color: "var(--primary)" }}
            >
              {t("Try Again", "إعادة التسجيل")}
            </Button>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--primary)" }} />
            <p style={{ color: "var(--muted-text)" }}>
              {t("Processing...", "جاري المعالجة...")}
            </p>
          </div>
        )}

        {/* Helper Text */}
        <Card className="p-6" style={{ backgroundColor: "var(--surface)" }}>
          <h4 className="font-semibold mb-2" style={{ color: "var(--strong-text)" }}>
            {t("What to say?", "ماذا تقول؟")}
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--muted-text)" }}>
            <li>• {t("How are you feeling energy-wise?", "كيف تشعر من حيث الطاقة والتعب؟")}</li>
            <li>• {t("What's your mood today?", "ما هو مزاجك اليوم؟")}</li>
            <li>• {t("How is your mobility?", "كيف حالتك الحركية؟")}</li>
            <li>• {t("Any pain or discomfort?", "هل تشعر بأي ألم؟")}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
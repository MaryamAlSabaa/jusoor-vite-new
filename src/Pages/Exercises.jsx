import React, { useState, useEffect } from "react";
import { useAccessibility } from "../Entities/AccessibilityContext";
import { Exercise } from "../Entities/Exercise";
import ExerciseChatbot from "../components/ExerciseChatbot";
import { checkIn } from "../Entities/CheckIn";
import { Button, Card } from "../components";
import { User } from "../Entities/User";
import { useNavigate } from "react-router-dom";
import { Activity, Clock, ChevronRight, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ChatBaseAI } from "../integrations/ChatBaseAI";


export default function Exercises() {
  const [user, setUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [userFatigue, setUserFatigue] = useState(5);
  const [showChatbot, setShowChatbot] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const navigate = useNavigate();
  const { language, isRTL } = useAccessibility();
  const [isGeneratingExercises, setIsGeneratingExercises] = useState(false); // ADD THIS LINE


useEffect(() => {
  const handleFocus = () => loadData(); // reload whenever user comes back to this page
  window.addEventListener("focus", handleFocus);


  loadData(); // initial load

  return () => window.removeEventListener("focus", handleFocus);
}, []);
// In your Exercises.jsx loadData function
const loadData = async () => {
  if (isGeneratingExercises) {
    console.log("🔄 Already generating exercises, skipping...");
    return;
  }

  try {
    console.log("🔍 Starting loadData...");
    setIsGeneratingExercises(true);
    setLoading(true);
    
    const today = format(new Date(), "yyyy-MM-dd");
    const userData = await User.me();
    console.log("👤 User:", userData?.email);
    
    // SIMPLE DIRECT CHECK
    const localCheckIn = localStorage.getItem("currentCheckIn");
    console.log("📱 Raw localStorage:", localCheckIn);
    
    let todayCheck = null;
    
    if (localCheckIn) {
      try {
        const parsed = JSON.parse(localCheckIn);
        console.log("📋 Parsed check-in:", parsed);
        
        // Check if it's today AND belongs to current user
        const isToday = parsed.check_in_date === today;
        const isCurrentUser = parsed.created_by === userData.email;
        
        console.log("✅ Date check:", parsed.check_in_date, "===", today, "=>", isToday);
        console.log("✅ User check:", parsed.created_by, "===", userData.email, "=>", isCurrentUser);
        
        if (isToday && isCurrentUser) {
          todayCheck = parsed;
          console.log("🎯 VALID check-in found!");
        } else {
          console.log("❌ INVALID check-in - wrong date or user");
        }
      } catch (error) {
        console.error("❌ Error parsing check-in:", error);
      }
    }

    if (!todayCheck) {
      console.log("🚫 No valid check-in for today");
      setHasCheckedInToday(false);
      setExercises([]);
      return;
    }

    console.log("✅ CHECK-IN CONFIRMED! Fatigue:", todayCheck.fatigue_level);
    setHasCheckedInToday(true);
    setUserFatigue(todayCheck.fatigue_level);

    // Get exercises
    try {
      console.log("🤖 Getting exercises for fatigue level:", todayCheck.fatigue_level);
      const recommendations = await ChatBaseAI.getExerciseRecommendations(
        userData,
        todayCheck,
        {}
      );
      console.log("🎯 Exercises loaded:", recommendations.exercises?.length);
      setExercises(recommendations.exercises || []);
    } catch (error) {
      console.error("❌ Error getting exercises:", error);
      const fallback = ChatBaseAI.getFallbackExercises();
      setExercises(fallback.exercises || []);
    }
  } catch (error) {
    console.error("💥 Error in loadData:", error);
    setHasCheckedInToday(false);
    setExercises([]);
  } finally {
    setLoading(false);
    setIsGeneratingExercises(false);
  }
};

const handleExerciseAssistantClick = () => {
  if (!hasCheckedInToday) {
    navigate("/check-in-form");  // Direct to form instead of check-in page
  } else {
    setShowChatbot(true);
  }
};

  const getRecommendedExercises = () => {
    if (!Array.isArray(exercises)) return [];

    if (userFatigue >= 7) {
      return exercises.filter(
        (ex) =>
          ex.difficulty === "beginner" &&
          ["seated", "wheelchair"].includes(ex.mobility_requirement)
      );
    } else if (userFatigue >= 4) {
      return exercises.filter((ex) =>
        ["beginner", "intermediate"].includes(ex.difficulty)
      );
    }
    return exercises;
  };

  const recommendedExercises = getRecommendedExercises();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity
            className="w-12 h-12 mx-auto mb-4 animate-pulse"
            style={{ color: "var(--primary)" }}
          />
          <p style={{ color: "var(--muted-text)" }}>
            {isRTL ? "جاري تحميل التمارين..." : "Loading exercises..."}
          </p>
        </div>
      </div>
    );
  }

  // If no check-in today
  if (!hasCheckedInToday) {
    return (
      <div className="min-h-screen p-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--strong-text)" }}>
            {isRTL ? "التمارين" : "Exercises"}
          </h1>
          <p style={{ color: "var(--muted-text)" }}>
            {isRTL ? "تمارين آمنة معتمدة من الأطباء" : "Doctor-approved safe exercises"}
          </p>

          {/* Check-In Required Card */}
          <Card
            className="p-6 text-center"
            style={{ backgroundColor: "var(--accent-30)", borderColor: "var(--accent)" }}
          >
            <Activity className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--accent)" }} />
            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--strong-text)" }}>
              {isRTL ? "التسجيل اليومي مطلوب" : "Daily Check-In Required"}
            </h3>
            <p className="mb-4" style={{ color: "var(--muted-text)" }}>
              {isRTL
                ? "يجب إكمال التسجيل اليومي أولاً للحصول على تمارين مخصصة آمنة"
                : "Please complete your daily check-in first to get personalized safe exercises"}
            </p>
<Button
  onClick={() => navigate("/check-in-form")}  // Changed from "/check-in"
  style={{
    backgroundColor: "var(--primary)",
    color: "white",
    padding: "0.75rem 2rem",
    fontSize: "1.1rem",
  }}
>
  {isRTL ? "اذهب للتسجيل" : "Go to Check-In"}
</Button>
          </Card>
        </div>
      </div>
    );
  }

  // If checked in
  return (
    <div className="min-h-screen p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--strong-text)" }}>
          {isRTL ? "التمارين" : "Exercises"}
        </h1>
        <p style={{ color: "var(--muted-text)" }}>
          {isRTL ? "تمارين آمنة معتمدة من الأطباء" : "Doctor-approved safe exercises"}
        </p>

        {/* Exercise Assistant Card */}
        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-all mb-6"
          style={{ backgroundColor: "var(--surface)" }}
          onClick={handleExerciseAssistantClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--primary-100)" }}
              >
                <Activity className="w-6 h-6" style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: "var(--strong-text)" }}>
                  {isRTL ? "مساعد التمارين الذكي" : "Smart Exercise Assistant"}
                </h3>
                <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                  {isRTL
                    ? "احصل على تمارين مخصصة آمنة بناءً على حالتك اليومية"
                    : "Get personalized safe exercises based on your daily condition"}
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6" style={{ color: "var(--muted-text)" }} />
          </div>
        </Card>

        {/* Chatbot Modal */}
        {showChatbot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md h-[80vh] flex flex-col p-6">
              <ExerciseChatbot
                user={user}
                isRTL={isRTL}
                onClose={() => setShowChatbot(false)}
              />
            </div>
          </div>
        )}

        {userFatigue >= 7 && (
          <Card className="p-6" style={{ backgroundColor: "var(--accent-30)", borderColor: "var(--accent)" }}>
            <p className="font-medium" style={{ color: "var(--strong-text)" }}>
              {isRTL
                ? "لاحظنا أنك تشعر بالتعب اليوم. نعرض تمارين خفيفة فقط."
                : "We noticed you're feeling tired today. Showing only gentle exercises."}
            </p>
          </Card>
        )}

        {!showChatbot && (
          <div className="grid gap-4">
            {recommendedExercises.map((exercise) => (
              <Card
                key={exercise.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all"
                style={{ backgroundColor: "var(--surface)" }}
                onClick={() => setSelectedExercise(exercise)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--strong-text)" }}>
                      {isRTL ? exercise.title_ar || exercise.title : exercise.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm" style={{ color: "var(--muted-text)" }}>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exercise.duration_minutes} {isRTL ? "دقيقة" : "min"}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: "var(--primary-100)", color: "var(--primary)" }}
                      >
                        {exercise.category}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6" style={{ color: "var(--muted-text)" }} />
                </div>
              </Card>
            ))}
          </div>
        )}

        {!showChatbot && recommendedExercises.length === 0 && (
          <Card className="p-12 text-center" style={{ backgroundColor: "var(--surface)" }}>
            <Activity className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--muted-text)" }} />
            <p style={{ color: "var(--muted-text)" }}>
              {isRTL ? "لا توجد تمارين متاحة حالياً" : "No exercises available yet"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

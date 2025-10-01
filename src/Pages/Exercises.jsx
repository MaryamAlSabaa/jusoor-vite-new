import React, { useState, useEffect } from "react";
import { Exercise } from "../Entities/Exercise";
import { CheckIn } from "../Entities/CheckIn";
import { Button, Card } from "../components";
import { User } from "../Entities/User";

import { Activity, Clock, ChevronRight, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function Exercises() {
  const [user, setUser] = useState(null);
  const [isRTL, setIsRTL] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [userFatigue, setUserFatigue] = useState(5);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setIsRTL(userData.language_preference === "ar");

      // Get today's fatigue level
      const today = format(new Date(), "yyyy-MM-dd");
      const checkIns = await CheckIn.filter({ check_in_date: today, created_by: userData.email });
      if (checkIns.length > 0) {
        setUserFatigue(checkIns[0].fatigue_level);
      }

      // Load exercises
      const allExercises = await Exercise.list();
      setExercises(allExercises);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const getRecommendedExercises = () => {
    // Rule-based filtering based on fatigue
    if (userFatigue >= 7) {
      return exercises.filter(ex => ex.difficulty === "beginner" && ["seated", "wheelchair"].includes(ex.mobility_requirement));
    } else if (userFatigue >= 4) {
      return exercises.filter(ex => ["beginner", "intermediate"].includes(ex.difficulty));
    }
    return exercises;
  };

  const recommendedExercises = getRecommendedExercises();

  if (selectedExercise) {
    return (
      <div className="min-h-screen p-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-2xl mx-auto space-y-6">
          <Button
            onClick={() => setSelectedExercise(null)}
            variant="ghost"
            style={{ color: "var(--primary)" }}
          >
            ← {isRTL ? "رجوع" : "Back"}
          </Button>

          {selectedExercise.image_url && (
            <img
              src={selectedExercise.image_url}
              alt={isRTL ? selectedExercise.title_ar : selectedExercise.title}
              className="w-full h-64 object-cover rounded-2xl"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--strong-text)" }}>
              {isRTL ? selectedExercise.title_ar || selectedExercise.title : selectedExercise.title}
            </h1>
            <div className="flex items-center gap-4 text-sm" style={{ color: "var(--muted-text)" }}>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedExercise.duration_minutes} {isRTL ? "دقيقة" : "min"}
              </span>
              <span className="px-3 py-1 rounded-full" style={{ backgroundColor: "var(--primary-100)", color: "var(--primary)" }}>
                {selectedExercise.difficulty}
              </span>
            </div>
          </div>

          <Card className="p-6" style={{ backgroundColor: "var(--surface)" }}>
            <h3 className="font-semibold mb-3" style={{ color: "var(--strong-text)" }}>
              {isRTL ? "الوصف" : "Description"}
            </h3>
            <p style={{ color: "var(--muted-text)" }}>
              {isRTL ? selectedExercise.description_ar || selectedExercise.description : selectedExercise.description}
            </p>
          </Card>

          <Card className="p-6" style={{ backgroundColor: "var(--surface)" }}>
            <h3 className="font-semibold mb-3" style={{ color: "var(--strong-text)" }}>
              {isRTL ? "الخطوات" : "Steps"}
            </h3>
            <ol className="space-y-3">
              {(isRTL ? selectedExercise.steps_ar || selectedExercise.steps : selectedExercise.steps).map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: "var(--primary-100)", color: "var(--primary)" }}
                  >
                    {index + 1}
                  </span>
                  <span style={{ color: "var(--muted-text)" }}>{step}</span>
                </li>
              ))}
            </ol>
          </Card>

          {selectedExercise.contraindications && (
            <Card className="p-6" style={{ backgroundColor: "rgba(217,83,79,0.1)", borderColor: "var(--error)" }}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--error)" }} />
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: "var(--error)" }}>
                    {isRTL ? "تحذيرات السلامة" : "Safety Warnings"}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--strong-text)" }}>
                    {isRTL ? selectedExercise.contraindications_ar || selectedExercise.contraindications : selectedExercise.contraindications}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--strong-text)" }}>
            {isRTL ? "التمارين" : "Exercises"}
          </h1>
          <p style={{ color: "var(--muted-text)" }}>
            {isRTL ? "تمارين آمنة معتمدة من الأطباء" : "Doctor-approved safe exercises"}
          </p>
        </div>

        {userFatigue >= 7 && (
          <Card className="p-6" style={{ backgroundColor: "var(--accent-30)", borderColor: "var(--accent)" }}>
            <p className="font-medium" style={{ color: "var(--strong-text)" }}>
              {isRTL 
                ? "لاحظنا أنك تشعر بالتعب اليوم. نعرض تمارين خفيفة فقط."
                : "We noticed you're feeling tired today. Showing only gentle exercises."}
            </p>
          </Card>
        )}

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
                    <span className="px-3 py-1 rounded-full" style={{ backgroundColor: "var(--primary-100)", color: "var(--primary)" }}>
                      {exercise.category}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6" style={{ color: "var(--muted-text)" }} />
              </div>
            </Card>
          ))}
        </div>

        {recommendedExercises.length === 0 && (
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
import { Exercise } from "../Entities/Exercise";

export const ExerciseRecommender = {
  getPersonalizedExercises: async (userData, currentState) => {
    const {
      fatigue_level,
      mobility_today,
      specific_concerns = []
    } = currentState;

    const {
      age,
      pregnancy_status,
      ms_severity,
      primary_symptoms,
      mobility_aid,
      heat_sensitivity
    } = userData.medical_profile;

    // Get all exercises
    const allExercises = await Exercise.list();
    
    // Filter based on multiple factors
    let filteredExercises = allExercises.filter(exercise => {
      // 1. Filter by fatigue level
      if (fatigue_level >= 8 && exercise.difficulty !== "beginner") return false;
      if (fatigue_level >= 6 && exercise.difficulty === "advanced") return false;
      
      // 2. Filter by mobility today
      if (mobility_today === "difficult" && !["seated", "wheelchair"].includes(exercise.mobility_requirement)) return false;
      if (mobility_today === "moderate" && exercise.mobility_requirement === "assisted") return false;
      
      // 3. Filter by MS severity
      if (ms_severity === "severe" && exercise.difficulty !== "beginner") return false;
      if (ms_severity === "moderate" && exercise.difficulty === "advanced") return false;
      
      // 4. Filter by age - adjust intensity for age
      if (age > 60 && exercise.duration_minutes > 20) return false;
      if (age > 50 && exercise.duration_minutes > 30) return false;
      
      // 5. Filter for pregnancy safety
      if (pregnancy_status !== "not_pregnant") {
        // Avoid exercises that could risk pregnancy
        if (exercise.contraindications?.toLowerCase().includes("pregnant")) return false;
        if (exercise.category === "strength" && exercise.difficulty === "advanced") return false;
      }
      
      // 6. Filter by specific symptoms
      if (primary_symptoms.includes("balance_issues") && exercise.category === "balance") {
        // Only include balance exercises if mobility is good today
        if (mobility_today !== "good") return false;
      }
      
      // 7. Filter for heat sensitivity
      if (heat_sensitivity && exercise.category === "cardio") {
        return exercise.duration_minutes <= 10; // Shorter cardio sessions
      }
      
      return true;
    });

    // Sort by relevance
    filteredExercises.sort((a, b) => {
      // Prioritize seated exercises for high fatigue
      if (fatigue_level >= 7) {
        if (a.mobility_requirement === "seated" && b.mobility_requirement !== "seated") return -1;
        if (b.mobility_requirement === "seated" && a.mobility_requirement !== "seated") return 1;
      }
      
      // Shorter duration for higher fatigue
      if (a.duration_minutes < b.duration_minutes) return -1;
      if (a.duration_minutes > b.duration_minutes) return 1;
      
      return 0;
    });

    return filteredExercises.slice(0, 3); // Return top 3 recommendations
  },

  generateSafetyAdvice: (userData, currentState, exercises) => {
    const advice = [];
    const { age, pregnancy_status, ms_severity, heat_sensitivity } = userData.medical_profile;
    const { fatigue_level } = currentState;

    if (fatigue_level >= 8) {
      advice.push("• Limit to 5-10 minutes maximum");
      advice.push("• Take frequent breaks");
      advice.push("• Stop immediately if you feel dizzy");
    }

    if (age > 60) {
      advice.push("• Move slowly and deliberately");
      advice.push("• Use support if needed");
    }

    if (pregnancy_status !== "not_pregnant") {
      advice.push("• Avoid lying on your back after first trimester");
      advice.push("• Stay hydrated and don't overheat");
    }

    if (heat_sensitivity) {
      advice.push("• Exercise in cool environment");
      advice.push("• Have cool water nearby");
      advice.push("• Stop if you feel overheated");
    }

    if (ms_severity === "severe") {
      advice.push("• Have assistance available");
      advice.push("• Focus on range of motion rather than strength");
    }

    return advice;
  }
};
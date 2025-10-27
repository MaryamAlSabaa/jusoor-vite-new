// src/integrations/ChatBaseAI.js
export class ChatBaseAI {
  static async getExerciseRecommendations(userData, checkInData, userResponses) {
  try {
    console.log("🎯 Getting REAL AI exercise recommendations...");
    console.log("📊 Check-in data:", checkInData);
    console.log("👤 User data:", userData);

    // Construct the prompt for ChatBase
    const prompt = this.buildPrompt(userData, checkInData, userResponses);

    // Call backend with ALL data
    const response = await this.callBackendAPI(prompt, userData, checkInData, userResponses);

    // Parse the response into exercises and safety advice
    return this.parseChatBaseResponse(response);
    
  } catch (error) {
    console.error('❌ Error getting AI recommendations:', error);
    console.log('🔄 Falling back to mock data...');
    return await this.getMockRecommendations(checkInData);
  }
}
  static buildPrompt(userData, checkInData, userResponses) {
    // Combine all data sources
    const fatigue = userResponses.fatigue_level || checkInData?.fatigue_level || 5;
    const mobility = userResponses.mobility_today || checkInData?.mobility_level || 'moderate';
    const concerns = userResponses.specific_concerns || checkInData?.symptoms || [];
    const mood = checkInData?.mood || 'neutral';
    
    // Get user medical profile
    const medicalProfile = userData?.medical_profile || {};
    const age = medicalProfile.age || 'unknown';
    const msSeverity = medicalProfile.ms_severity || 'moderate';
    const primarySymptoms = medicalProfile.primary_symptoms || [];
    const heatSensitivity = medicalProfile.heat_sensitivity || false;
    const mobilityAid = medicalProfile.mobility_aid || 'none';

    return `
You are Jusoor MS Exercise Assistant. Recommend safe, personalized exercises for a Multiple Sclerosis patient.

PATIENT PROFILE:
- Age: ${age}
- MS Severity: ${msSeverity}
- Primary Symptoms: ${primarySymptoms.join(', ') || 'none'}
- Heat Sensitivity: ${heatSensitivity ? 'Yes' : 'No'}
- Mobility Aid: ${mobilityAid}

TODAY'S CONDITION:
- Fatigue Level: ${fatigue}/10
- Mobility: ${mobility}
- Mood: ${mood}
- Specific Concerns: ${concerns.join(', ') || 'none'}

REQUIREMENTS:
1. Recommend 2-3 specific, safe exercises
2. Provide personalized safety advice
3. Consider fatigue level and mobility limitations
4. Focus on seated exercises if fatigue >= 7 or mobility is difficult
5. Include Arabic translations for Middle Eastern patients

RESPONSE FORMAT (JSON only):
{
  "exercises": [
    {
      "id": 1,
      "title": "Exercise name in English",
      "title_ar": "اسم التمرين بالعربية",
      "description": "Brief description in English",
      "description_ar": "وصف مختصر بالعربية", 
      "duration_minutes": 5-15,
      "category": "relaxation/strength/flexibility/balance/cardio",
      "difficulty": "beginner/intermediate",
      "mobility_requirement": "seated/standing/wheelchair"
    }
  ],
  "safety_advice": [
    "Personalized safety advice 1",
    "Personalized safety advice 2"
  ]
}

IMPORTANT: Return ONLY valid JSON, no other text.
`;
  }

  static async callBackendAPI(prompt, userData, checkInData, userResponses) {
  console.log("🚀 Calling backend API with user data...");
  console.log("👤 User data:", userData);
  console.log("📊 Check-in data:", checkInData);
  
  try {
    const response = await fetch('/api/chatbase', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: prompt,
        userData: userData,        // Add this
        checkInData: checkInData,  // Add this
        userResponses: userResponses, // Add this
        timestamp: new Date().toISOString()
      })
    });

    console.log("📡 API Response status:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ API Error:', text);
      throw new Error(`Backend API error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log("✅ API Response received");
    return data;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  }
}
  static parseChatBaseResponse(chatbaseResponse) {
  try {
    console.log("🔍 Parsing ChatBase response:", chatbaseResponse);
    
    // ChatBase returns the response in the "text" field
    let message = chatbaseResponse.text || chatbaseResponse.content;
    
    if (!message) {
      throw new Error('No message in response');
    }

    console.log("📄 Raw AI Response:", message);

    // Try to extract JSON from the response
    const jsonMatch = message.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const jsonString = jsonMatch[0];
        console.log("📦 Extracted JSON:", jsonString);
        const parsed = JSON.parse(jsonString);
        
        if (parsed.exercises && Array.isArray(parsed.exercises)) {
          console.log("✅ Valid exercise recommendations received");
          return parsed;
        }
      } catch (jsonError) {
        console.log("❌ JSON parsing failed, using text response");
      }
    }

    // If no valid JSON found, convert the text response to exercise format
    console.log("🔄 Converting text response to exercise format");
    return this.convertTextToExercises(message);
    
  } catch (error) {
    console.error('❌ Error parsing ChatBase response:', error);
    return this.getFallbackExercises();
  }
}

static convertTextToExercises(aiText) {
  // Create exercise objects from the AI text response
  const exercises = [
    {
      id: 1,
      title: "AI Recommended Exercise",
      title_ar: "تمارين موصى بها من الذكاء الاصطناعي",
      description: aiText,
      description_ar: "توصيات مخصصة بناءً على حالتك الصحية",
      duration_minutes: 10,
      category: "custom",
      difficulty: "beginner",
      mobility_requirement: "seated"
    }
  ];

  const safetyAdvice = [
    "Listen to your body and take breaks as needed",
    "Stop immediately if you experience any pain or dizziness",
    "Consult with your healthcare provider before starting new exercises"
  ];

  return {
    exercises: exercises,
    safety_advice: safetyAdvice
  };
}
  static async getMockRecommendations(checkInData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fatigue = checkInData?.fatigue_level || 5;
    const mobility = checkInData?.mobility_level || 3;
    
    console.log(`🎯 Generating MOCK exercises for fatigue: ${fatigue}/10, mobility: ${mobility}/5`);

    if (fatigue >= 7) {
      // High fatigue - gentle seated exercises only
      return {
        exercises: [
          {
            id: 101,
            title: "Gentle Seated Breathing",
            title_ar: "تمارين التنفس الجلوس الخفيفة",
            description: "Calming breathing exercises while seated to manage high fatigue days. Focus on slow, deep breaths to reduce stress.",
            description_ar: "تمارين التنفس المهدئة أثناء الجلوس لإدارة أيام الإرهاق الشديد. ركز على أنفاس بطيئة وعميقة لتقليل التوتر.",
            duration_minutes: 8,
            category: "relaxation",
            difficulty: "beginner",
            mobility_requirement: "seated"
          },
          {
            id: 102,
            title: "Seated Neck & Shoulder Rolls",
            title_ar: "لف الرقبة والكتفين أثناء الجلوس",
            description: "Gentle circular movements to relieve tension in neck and shoulders. Perfect for days when standing is difficult.",
            description_ar: "حركات دائرية لطيفة لتخفيف التوتر في الرقبة والكتفين. مثالي للأيام التي يكون فيها الوقوف صعبًا.",
            duration_minutes: 6,
            category: "flexibility",
            difficulty: "beginner",
            mobility_requirement: "seated"
          },
          {
            id: 103,
            title: "Hand & Wrist Exercises",
            title_ar: "تمارين اليد والرسغ",
            description: "Simple movements to maintain hand mobility and circulation. Can be done while resting in bed or chair.",
            description_ar: "حركات بسيطة للحفاظ على حركة اليد والدورة الدموية. يمكن القيام بها أثناء الراحة في السرير أو الكرسي.",
            duration_minutes: 5,
            category: "mobility",
            difficulty: "beginner",
            mobility_requirement: "seated"
          }
        ],
        safety_advice: [
          "Take frequent breaks and listen to your body",
          "Stay hydrated and rest when needed",
          "Stop immediately if you feel dizzy or experience pain",
          "These exercises are designed for high fatigue days"
        ]
      };
    } else if (fatigue >= 4) {
      // Moderate fatigue - mix of seated and light standing
      return {
        exercises: [
          {
            id: 201,
            title: "Chair Yoga Poses",
            title_ar: "وضعيات اليوجا على الكرسي",
            description: "Gentle yoga poses adapted for sitting to improve flexibility and circulation. Great for moderate energy days.",
            description_ar: "وضعيات يوجا لطيفة معدلة للجلوس لتحسين المرونة والدورة الدموية. رائع لأيام الطاقة المعتدلة.",
            duration_minutes: 12,
            category: "flexibility",
            difficulty: "beginner",
            mobility_requirement: "seated"
          },
          {
            id: 202,
            title: "Light Standing Balance",
            title_ar: "تمارين التوازن الخفيفة وقوفاً",
            description: "Simple balance practice while holding onto a chair for support. Build confidence slowly.",
            description_ar: "ممارسة توازن بسيطة أثناء التمسك بالكرسي للدعم. ابني الثقة ببطء.",
            duration_minutes: 8,
            category: "balance",
            difficulty: "intermediate",
            mobility_requirement: "standing"
          },
          {
            id: 203,
            title: "Seated Marching",
            title_ar: "الركض في المكان أثناء الجلوس",
            description: "Gentle leg lifts while seated to maintain leg strength and circulation without overexertion.",
            description_ar: "رفع الساقين بلطف أثناء الجلوس للحفاظ على قوة الساق والدورة الدموية دون إجهاد.",
            duration_minutes: 10,
            category: "strength",
            difficulty: "beginner",
            mobility_requirement: "seated"
          }
        ],
        safety_advice: [
          "Use support for balance exercises",
          "Move slowly and deliberately",
          "Focus on proper breathing throughout",
          "You can skip standing exercises if feeling unsteady"
        ]
      };
    } else {
      // Low fatigue - more active exercises
      return {
        exercises: [
          {
            id: 301,
            title: "Light Walking",
            title_ar: "المشي الخفيف",
            description: "Gentle walking to maintain mobility and improve circulation. Start with short distances and gradually increase.",
            description_ar: "المشي اللطيف للحفاظ على الحركة وتحسين الدورة الدموية. ابدأ بمسافات قصيرة وزد تدريجياً.",
            duration_minutes: 15,
            category: "cardio",
            difficulty: "beginner",
            mobility_requirement: "standing"
          },
          {
            id: 302,
            title: "Wall Push-ups",
            title_ar: "الضغط على الحائط",
            description: "Upper body strength exercise using wall for support. Great for building arm and chest strength safely.",
            description_ar: "تمرين قوة الجزء العلوي من الجسم باستخدام الحائط للدعم. رائع لبناء قوة الذراعين والصدر بأمان.",
            duration_minutes: 8,
            category: "strength",
            difficulty: "intermediate",
            mobility_requirement: "standing"
          },
          {
            id: 303,
            title: "Heel-to-Toe Stand",
            title_ar: "الوقوف من الكعب إلى إصبع القدم",
            description: "Balance exercise to improve stability and coordination. Always have support nearby when trying this.",
            description_ar: "تمرين توازن لتحسين الاستقرار والتنسيق. احرص دائمًا على وجود دعم قريب عند تجربة هذا.",
            duration_minutes: 6,
            category: "balance",
            difficulty: "intermediate",
            mobility_requirement: "standing"
          }
        ],
        safety_advice: [
          "Maintain good posture throughout exercises",
          "Keep water nearby and stay hydrated",
          "Stop if you feel any discomfort or dizziness",
          "Use walking aids if needed for balance"
        ]
      };
    }
  }

  static getFallbackExercises() {
    console.log("🔄 Loading fallback exercises");
    return {
      exercises: [
        {
          id: 1,
          title: "Gentle Breathing Exercises",
          title_ar: "تمارين التنفس الخفيفة",
          description: "Deep breathing to reduce stress and improve oxygen flow",
          description_ar: "تمارين التنفس العميق لتقليل التوتر وتحسين تدفق الأكسجين",
          duration_minutes: 5,
          category: "relaxation",
          difficulty: "beginner",
          mobility_requirement: "seated"
        },
        {
          id: 2,
          title: "Seated Leg Lifts",
          title_ar: "رفع الساقين أثناء الجلوس",
          description: "Strengthen leg muscles while seated safely",
          description_ar: "تقوية عضلات الساقين أثناء الجلوس بأمان",
          duration_minutes: 10,
          category: "strength",
          difficulty: "beginner",
          mobility_requirement: "seated"
        }
      ],
      safety_advice: [
        "Listen to your body and take breaks as needed",
        "Stop immediately if you experience any pain or dizziness"
      ]
    };
  }
}
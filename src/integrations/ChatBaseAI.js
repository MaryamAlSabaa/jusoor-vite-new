// // ChatBaseAI.js
// export class ChatBaseAI {
//   static async getExerciseRecommendations(userData, checkInData, userResponses) {
//     try {
//       // Construct the prompt for ChatBase
//       const prompt = this.buildPrompt(userData, checkInData, userResponses);

//       // Call backend proxy instead of ChatBase directly
//       const response = await this.callBackendAPI(prompt);

//       // Parse the response into exercises and safety advice
//       return this.parseChatBaseResponse(response);
//     } catch (error) {
//       console.error('Error getting AI recommendations:', error);
//       // Return fallback exercises if API fails
//       return this.getFallbackExercises();
//     }
//   }

//   static buildPrompt(userData, checkInData, userResponses) {
//     const fatigue = userResponses.fatigue_level || checkInData?.fatigue_level || 5;
//     const mobility = userResponses.mobility_today || 'moderate';
//     const concerns = userResponses.specific_concerns || [];

//     return `
// You are Jusoor MS Exercise Assistant. Recommend safe exercises for an MS patient.

// Patient Context:
// - Fatigue level: ${fatigue}/10
// - Mobility today: ${mobility}
// - Specific concerns: ${concerns.join(', ') || 'none'}
// - Condition: Multiple Sclerosis

// Please provide:
// 1. 2-3 specific, safe exercise recommendations
// 2. Safety advice tailored to their current condition

// Format your response as JSON:
// {
//   "exercises": [
//     {
//       "title": "Exercise name",
//       "title_ar": "اسم التمرين بالعربية",
//       "description": "Brief description",
//       "description_ar": "وصف بالعربية",
//       "duration_minutes": 5-15,
//       "category": "relaxation/strength/flexibility/balance"
//     }
//   ],
//   "safety_advice": ["advice 1", "advice 2"]
// }

// Focus on seated exercises if fatigue >= 7 or mobility is difficult.
// `;
//   }

//   static async callBackendAPI(prompt) {
//     // Call your backend proxy endpoint
//     const response = await fetch('http://localhost:5000/api/chatbase', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ prompt })
//     });

//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`Backend ChatBase API error: ${response.status} - ${text}`);
//     }

//     return response.json();
//   }

//   static parseChatBaseResponse(chatbaseResponse) {
//     try {
//       const message = chatbaseResponse.message || chatbaseResponse.choices?.[0]?.message?.content;

//       if (!message) {
//         throw new Error('No message in response');
//       }

//       // Try to extract JSON
//       const jsonMatch = message.match(/\{[\s\S]*\}/);
//       if (jsonMatch) return JSON.parse(jsonMatch[0]);

//       return this.getFallbackExercises();
//     } catch (error) {
//       console.error('Error parsing ChatBase response:', error);
//       return this.getFallbackExercises();
//     }
//   }

//   static getFallbackExercises() {
//     return {
//       exercises: [
//         {
//           id: 1,
//           title: "Gentle Breathing Exercises",
//           title_ar: "تمارين التنفس الخفيفة",
//           description: "Deep breathing to reduce stress and improve oxygen flow",
//           description_ar: "تمارين التنفس العميق لتقليل التوتر وتحسين تدفق الأكسجين",
//           duration_minutes: 5,
//           category: "relaxation"
//         },
//         {
//           id: 2,
//           title: "Seated Leg Lifts",
//           title_ar: "رفع الساقين أثناء الجلوس",
//           description: "Strengthen leg muscles while seated safely",
//           description_ar: "تقوية عضلات الساقين أثناء الجلوس بأمان",
//           duration_minutes: 10,
//           category: "strength"
//         }
//       ],
//       safety_advice: [
//         "Listen to your body and take breaks as needed",
//         "Stop immediately if you experience any pain or dizziness"
//       ]
//     };
//   }
// }
// src/integrations/ChatBaseAI.js

export class ChatBaseAI {
  static async getExerciseRecommendations(userData, checkInData, userResponses) {
    try {
      console.log("🎯 Getting exercise recommendations...");
      console.log("📊 Check-in data:", checkInData);
      
      // For now, use mock data since backend has CORS issues
      // Remove this once backend is properly configured
      return await this.getMockRecommendations(checkInData);
      
    } catch (error) {
      console.error('❌ Error getting AI recommendations:', error);
      return this.getFallbackExercises();
    }
  }

  static async getMockRecommendations(checkInData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fatigue = checkInData?.fatigue_level || 5;
    const mobility = checkInData?.mobility_level || 3;
    
    console.log(`🎯 Generating exercises for fatigue: ${fatigue}/10, mobility: ${mobility}/5`);

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

  // Keep the original methods for when backend is ready
  static buildPrompt(userData, checkInData, userResponses) {
    const fatigue = userResponses.fatigue_level || checkInData?.fatigue_level || 5;
    const mobility = userResponses.mobility_today || 'moderate';
    const concerns = userResponses.specific_concerns || [];

    return `
You are Jusoor MS Exercise Assistant. Recommend safe exercises for an MS patient.

Patient Context:
- Fatigue level: ${fatigue}/10
- Mobility today: ${mobility}
- Specific concerns: ${concerns.join(', ') || 'none'}
- Condition: Multiple Sclerosis

Please provide:
1. 2-3 specific, safe exercise recommendations
2. Safety advice tailored to their current condition

Format your response as JSON:
{
  "exercises": [
    {
      "title": "Exercise name",
      "title_ar": "اسم التمرين بالعربية",
      "description": "Brief description",
      "description_ar": "وصف بالعربية",
      "duration_minutes": 5-15,
      "category": "relaxation/strength/flexibility/balance"
    }
  ],
  "safety_advice": ["advice 1", "advice 2"]
}

Focus on seated exercises if fatigue >= 7 or mobility is difficult.
`;
  }

  static async callBackendAPI(prompt) {
    // This will be used when backend CORS is fixed
    const response = await fetch('http://localhost:5000/api/chatbase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Backend ChatBase API error: ${response.status} - ${text}`);
    }

    return response.json();
  }

  static parseChatBaseResponse(chatbaseResponse) {
    try {
      const message = chatbaseResponse.message || chatbaseResponse.choices?.[0]?.message?.content;

      if (!message) {
        throw new Error('No message in response');
      }

      // Try to extract JSON
      const jsonMatch = message.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);

      return this.getFallbackExercises();
    } catch (error) {
      console.error('Error parsing ChatBase response:', error);
      return this.getFallbackExercises();
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
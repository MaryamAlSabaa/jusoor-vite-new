import React, { useState, useEffect } from 'react';
import { ExerciseRecommender } from '../integrations/ExerciseRecommender';
import { Button, Card } from './index';
import { Send, Activity, Heart, AlertTriangle, Clock } from 'lucide-react';
import { ChatBaseAI } from '../integrations/ChatBaseAI'; // ADD THIS IMPORT
import { checkIn } from '../Entities/CheckIn'; // ADD THIS IMPORT
import { format } from 'date-fns'; // ADD THIS IMPORT

export default function ExerciseChatbot({ user, isRTL, onClose }) {
  const [conversationStage, setConversationStage] = useState('welcome');
  const [userResponses, setUserResponses] = useState({});
  const [recommendedExercises, setRecommendedExercises] = useState([]);
  const [safetyAdvice, setSafetyAdvice] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const questions = {
    welcome: {
      text: isRTL 
        ? "مرحباً! أنا مساعد التمارين الآمنة للتصلب المتعدد. سأسألك ٣ أسئلة سريعة لأوصي بأفضل التمارين المناسبة لحالتك اليوم."
        : "Hi! I'm your safe MS exercise assistant. I'll ask 3 quick questions to recommend the best exercises for you today.",
      type: 'message'
    },
    fatigue: {
      text: isRTL 
        ? "١. ما هو مستوى طاقتك اليوم من ١ إلى ١٠؟ (١ = مرهق جداً، ١٠ = مليء بالطاقة)"
        : "1. What's your energy level today from 1-10? (1=very tired, 10=full of energy)",
      type: 'number',
      key: 'fatigue_level'
    },
    mobility: {
      text: isRTL 
        ? "٢. كيف هي قدرتك الحركية اليوم؟"
        : "2. How is your mobility today?",
      type: 'options',
      key: 'mobility_today',
      options: [
        { value: 'good', label: isRTL ? 'جيدة - أستطيع الحركة بسهولة' : 'Good - I can move easily' },
        { value: 'moderate', label: isRTL ? 'متوسطة - بعض الصعوبة' : 'Moderate - Some difficulty' },
        { value: 'difficult', label: isRTL ? 'صعبة - أحتاج للجلوس' : 'Difficult - Need to sit' }
      ]
    },
    concerns: {
      text: isRTL 
        ? "٣. هل هناك أي مشاكل محددة today؟ (اختياري)"
        : "3. Any specific concerns today? (optional)",
      type: 'multiselect',
      key: 'specific_concerns',
      options: [
        { value: 'balance', label: isRTL ? 'مشاكل توازن' : 'Balance issues' },
        { value: 'pain', label: isRTL ? 'ألم' : 'Pain' },
        { value: 'numbness', label: isRTL ? 'تنميل' : 'Numbness' },
        { value: 'vision', label: isRTL ? 'مشاكل بصرية' : 'Vision issues' },
        { value: 'none', label: isRTL ? 'لا شيء' : 'None' }
      ]
    }
  };

  const handleResponse = (response) => {
    const currentQuestion = questions[conversationStage];
    if (currentQuestion.key) {
      setUserResponses(prev => ({
        ...prev,
        [currentQuestion.key]: response
      }));
    }

    // Move to next question or generate recommendations
    const stages = Object.keys(questions);
    const currentIndex = stages.indexOf(conversationStage);
    
    if (currentIndex < stages.length - 1) {
      setConversationStage(stages[currentIndex + 1]);
    } else {
      generateRecommendations();
    }
  };


const generateRecommendations = async () => {
  setIsLoading(true);
  try {
    console.log("Getting AI exercise recommendations...");

    const today = format(new Date(), "yyyy-MM-dd");
    const checkIns = await checkIn.filter({ 
      check_in_date: today, 
      created_by: user.email 
    });
    const todayCheckIn = checkIns.length > 0 ? checkIns[0] : null;

    const recommendations = await ChatBaseAI.getExerciseRecommendations(user, todayCheckIn, userResponses);

    console.log("AI recommendations:", recommendations);

    setRecommendedExercises(recommendations.exercises || []);
    setSafetyAdvice(recommendations.safety_advice || []);
    setConversationStage('results');
  } catch (error) {
    console.error('Error generating recommendations:', error);
    setConversationStage('error');
  } finally {
    setIsLoading(false);
  }
};


  const renderCurrentStep = () => {
    const current = questions[conversationStage];
    
    if (conversationStage === 'results') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Activity className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--primary)" }} />
            <h3 className="text-xl font-semibold" style={{ color: "var(--strong-text)" }}>
              {isRTL ? "التمارين الموصى بها" : "Recommended Exercises"}
            </h3>
            <p className="text-sm mt-1" style={{ color: "var(--muted-text)" }}>
              {isRTL 
                ? "مخصصة بناءً على حالتك اليومية وصحتك"
                : "Personalized based on your daily condition and health profile"}
            </p>
          </div>

          {recommendedExercises.map((exercise, index) => (
            <Card key={exercise.id} className="p-4" style={{ backgroundColor: "var(--surface)" }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2" style={{ color: "var(--strong-text)" }}>
                    {isRTL ? exercise.title_ar || exercise.title : exercise.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm" style={{ color: "var(--muted-text)" }}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {exercise.duration_minutes} {isRTL ? "دقيقة" : "min"}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: "var(--primary-100)", color: "var(--primary)" }}>
                      {exercise.category}
                    </span>
                  </div>
                  <p className="text-sm mt-2" style={{ color: "var(--muted-text)" }}>
                    {isRTL ? exercise.description_ar || exercise.description : exercise.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {safetyAdvice.length > 0 && (
            <Card className="p-4" style={{ backgroundColor: "rgba(255,204,102,0.2)", borderColor: "var(--accent)" }}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--accent)" }} />
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: "var(--strong-text)" }}>
                    {isRTL ? "نصائح السلامة" : "Safety Advice"}
                  </h4>
                  <ul className="text-sm space-y-1" style={{ color: "var(--strong-text)" }}>
                    {safetyAdvice.map((advice, index) => (
                      <li key={index}>{advice}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          <Button
            onClick={onClose}
            className="w-full"
            style={{ backgroundColor: "var(--primary)", color: "white" }}
          >
            {isRTL ? "العودة إلى التمارين" : "Back to Exercises"}
          </Button>
        </div>
      );
    }

    if (conversationStage === 'error') {
      return (
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--error)" }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--strong-text)" }}>
            {isRTL ? "عذراً، حدث خطأ" : "Sorry, something went wrong"}
          </h3>
          <p style={{ color: "var(--muted-text)" }}>
            {isRTL 
              ? "جرب تمارين التنفس أو التمدد الخفيف لمدة ٥-١٠ دقائق"
              : "Try gentle breathing exercises or light stretching for 5-10 minutes"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Question */}
        <Card className="p-4" style={{ backgroundColor: "var(--primary-100)" }}>
          <p style={{ color: "var(--strong-text)" }}>{current.text}</p>
        </Card>

        {/* Response Options */}
        <div className="space-y-3">
          {current.type === 'number' && (
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button
                  key={num}
                  onClick={() => handleResponse(num)}
                  className="h-12 rounded-lg border font-semibold transition-all"
                  style={{
                    backgroundColor: userResponses.fatigue_level === num ? "var(--primary)" : "white",
                    color: userResponses.fatigue_level === num ? "white" : "var(--strong-text)",
                    borderColor: userResponses.fatigue_level === num ? "var(--primary)" : "var(--primary-200)"
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          )}

          {current.type === 'options' && (
            <div className="space-y-2">
              {current.options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleResponse(option.value)}
                  className="w-full p-4 rounded-xl text-left transition-all"
                  style={{
                    backgroundColor: userResponses[current.key] === option.value ? "var(--primary-100)" : "var(--surface)",
                    border: `2px solid ${userResponses[current.key] === option.value ? "var(--primary)" : "var(--primary-200)"}`
                  }}
                >
                  <span style={{ color: "var(--strong-text)" }}>{option.label}</span>
                </button>
              ))}
            </div>
          )}

          {current.type === 'multiselect' && (
            <div className="space-y-2">
              {current.options.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    const currentConcerns = userResponses.specific_concerns || [];
                    const newConcerns = currentConcerns.includes(option.value)
                      ? currentConcerns.filter(c => c !== option.value)
                      : [...currentConcerns, option.value];
                    handleResponse(newConcerns);
                  }}
                  className="w-full p-4 rounded-xl text-left transition-all flex items-center gap-3"
                  style={{
                    backgroundColor: (userResponses.specific_concerns || []).includes(option.value) 
                      ? "var(--primary-100)" 
                      : "var(--surface)",
                    border: `2px solid ${(userResponses.specific_concerns || []).includes(option.value) 
                      ? "var(--primary)" 
                      : "var(--primary-200)"}`
                  }}
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      (userResponses.specific_concerns || []).includes(option.value)
                        ? 'bg-primary border-primary'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {(userResponses.specific_concerns || []).includes(option.value) && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span style={{ color: "var(--strong-text)" }}>{option.label}</span>
                </button>
              ))}
            </div>
          )}

          {current.type === 'message' && (
            <Button
              onClick={() => handleResponse('continue')}
              className="w-full"
              style={{ backgroundColor: "var(--primary)", color: "white" }}
            >
              {isRTL ? "ابدأ" : "Get Started"}
            </Button>
          )}
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-1">
          {Object.keys(questions).map((stage, index) => (
            <div
              key={stage}
              className={`h-1 rounded-full transition-all ${
                Object.keys(questions).indexOf(conversationStage) >= index
                  ? "bg-primary"
                  : "bg-primary-200"
              }`}
              style={{ width: '20px' }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6" style={{ color: "var(--primary)" }} />
          <div>
            <h3 className="font-semibold" style={{ color: "var(--strong-text)" }}>
              {isRTL ? "مساعد التمارين الذكي" : "Smart Exercise Assistant"}
            </h3>
            <p className="text-sm" style={{ color: "var(--muted-text)" }}>
              {isRTL ? "مخصص لمرضى التصلب المتعدد" : "Personalized for MS patients"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
          style={{ color: "var(--muted-text)" }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm" style={{ color: "var(--muted-text)" }}>
              {isRTL ? "جاري البحث عن التمارين المناسبة..." : "Finding the perfect exercises..."}
            </p>
          </div>
        ) : (
          renderCurrentStep()
        )}
      </div>
    </div>
  );
}
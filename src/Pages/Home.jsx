import React, { useState, useEffect } from "react";
import { useAccessibility } from "../Entities/AccessibilityContext";
import { createPageUrl } from "../utils";
import { checkIn } from "../Entities/CheckIn";
import { HealthData } from "../Entities/HealthData";
import { Button, Card, HealthCard, MedicationCard, AppointmentCard } from "../components/index";
import logo from '../assets/logo.png';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation, Link } from "react-router-dom";

import { Mic, Activity, TrendingUp,ThermometerSun , AlertCircle, Heart, 
  Moon,
  BarChart2,
  Calendar,
  BookOpen,
  Dumbbell,
  Phone,
  Bell, Check,
  Plus,
  Stethoscope,
  Share2,
  Pill,
  Beaker } from "lucide-react";
import { format } from "date-fns";
import { User } from "../Entities/User";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function VoiceAssistantCheckIn({ questions, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
 


  React.useEffect(() => {
    if (!listening && transcript) {
      setAnswers((prev) => [...prev, transcript]);
      resetTranscript();
      if (step < questions.length - 1) {
        setStep(step + 1);
        SpeechRecognition.startListening({ continuous: true });
      } else {
        onComplete && onComplete([...answers, transcript]);
      }
    }
  }, [listening]);

  const startAssistant = () => {
    setStep(0);
    setAnswers([]);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };


  return (
    <div className="p-6 bg-white rounded-xl shadow-md mt-6">
      <h3 className="text-xl font-bold mb-4">Voice Assistant Check-In</h3>
      {step < questions.length ? (
        <div>
          <p className="mb-4 text-lg">{questions[step]}</p>
          <button
            onClick={startAssistant}
            disabled={listening}
            className="bg-primary text-white px-4 py-2 rounded mb-2"
          >
            {listening ? "Listening..." : "Start Answering"}
          </button>
          <div className="mt-2">
            <strong>Transcript:</strong>
            <div className="bg-gray-100 rounded p-2 mt-1 min-h-[40px]">{transcript}</div>
          </div>
        </div>
      ) : (
        <div>
          <h4 className="mb-2">All questions answered!</h4>
          <ul className="list-disc pl-6">
            {answers.map((ans, idx) => (
              <li key={idx}><strong>{questions[idx]}</strong>: {ans}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Home() {


  const [user, setUser] = useState(null);
  const [todayCheckIn, setTodayCheckIn] = useState(null);
  const [recentHealth, setRecentHealth] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const location = useLocation();
  const [showTrend, setShowTrend] = useState(false);
  const { isRTL, language } = useAccessibility();
  const t = (en, ar) => (isRTL ? ar : en);

  // loads all existing appointments
   useEffect(() => {
    const loadAppointments = async () => {
      const allAppointments = await Appointment.getAll();
      setUpcomingAppointments(allAppointments);
    };
    loadAppointments();
  }, []);

  // listens for a newAppointment passed via location.state and appends it to the upcomingAppointments list
  useEffect(() => {
  if (location.state?.newAppointment) {
    setUpcomingAppointments(prev => [...prev, location.state.newAppointment]);
    
  }
}, [location.state]);

  const tempHistory = [
    { time: t("8 AM", "٨ صباحًا"), temp: 36.5 },
    { time: t("10 AM", "١٠ صباحًا"), temp: 36.8 },
    { time: t("12 PM", "١٢ ظهرًا"), temp: 37.0 },
    { time: t("2 PM", "٢ ظهرًا"), temp: 36.9 },
    { time: t("4 PM", "٤ عصرًا"), temp: 37.1 },
  ];

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  try {
    const userData = await User.me();
    setUser(userData);
  // setIsRTL(userData.language_preference === "ar"); // now handled by context

    // Get today's fatigue level
    const today = format(new Date(), "yyyy-MM-dd");
    const checkIns = await checkIn.filter({ check_in_date: today, created_by: userData.email });
    if (checkIns.length > 0) {
      setTodayCheckIn(checkIns[0]);
    }

    // Load today's health data
    try {
      const healthData = await HealthData.list("-date", 1); // Get most recent
      if (healthData && healthData.length > 0) {
        setRecentHealth(healthData[0]);
      } else {
        setRecentHealth({
          steps: 5230,
          sleep_hours: 7.5,
          heart_rate_avg: 72
        });
      }
    } catch (healthError) {
      console.error("Error loading health data:", healthError);
      // Set default values on error
      setRecentHealth({
        steps: 5230,
        sleep_hours: 7.5,
        heart_rate_avg: 72
      });
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("Good Morning", "صباح الخير");
    if (hour < 18) return t("Good Afternoon", "مساء الخير");
    return t("Good Evening", "مساء الخير");
  };

  return (
  <div className="min-h-screen p-6 pb-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--strong-text)" }}>
              {greeting()}
            </h1>
            <p className="text-lg mt-1" style={{ color: "var(--muted-text)" }}>
              {user?.full_name}
            </p>
          </div>
          <img 
            src={logo}
            alt="Jusoor logo"
            className="w-21 h-20 object-contain"
          />
        </div>

        <Link to={createPageUrl("VoiceCheckIn")}>
          <Card
            className="p-8 text-center cursor-pointer hover:shadow-lg transition-all"
            style={{
              background: `linear-gradient(135deg, var(--primary) 0%, var(--primary-300) 100%)`,
              border: "none"
            }}
          >
            <div
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
            >
              <Mic className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {t("Quick Voice Check-In", "تسجيل صوتي سريع")}
            </h3>
            <p className="text-white text-opacity-90">
              {t("Tap to tell us how you're feeling today", "اضغط للتحدث عن شعورك اليوم")}
            </p>
          </Card>
        </Link>
        <a data-linenumber="233" data-dynamic-content="true" className="block" href="/patientReport">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm 
                  font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
                  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
                  [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background 
                  hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full "  data-linenumber="234" data-dynamic-content="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-share2 w-4 h-4 mr-2 text-[var(--nabdh-primary)]" data-source-location="pages/Dashboard:235:10" data-dynamic-content="false">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                  </svg>{t("My Reports", "تقاريري")}

          </button>
        </a>
        {todayCheckIn ? (
          <Card className="p-6" style={{ backgroundColor: "var(--surface)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--success)" }} />
              <h3 className="font-semibold text-lg" style={{ color: "var(--strong-text)" }}>
                {t("Today's Check-In Complete", "تسجيل دخول اليوم مكتمل")}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                  {t("Fatigue", "الإرهاق")}
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--strong-text)" }}>
                  {todayCheckIn.fatigue_level}/10
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                  {t("Mood", "المزاج")}
                </p>
                <p className="text-2xl">
                  {todayCheckIn.mood === "very_happy" && "😊"}
                  {todayCheckIn.mood === "happy" && "🙂"}
                  {todayCheckIn.mood === "neutral" && "😐"}
                  {todayCheckIn.mood === "sad" && "😔"}
                  {todayCheckIn.mood === "very_sad" && "😢"}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                  {t("Pain", "الألم")}
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--strong-text)" }}>
                  {todayCheckIn.pain_level || 0}/10
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6" style={{ backgroundColor: "var(--accent-30)", borderColor: "var(--accent)" }}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6" style={{ color: "var(--accent)" }} />
              <p className="font-medium" style={{ color: "var(--strong-text)" }}>
                {t("You haven't checked in today yet", "لم تسجل دخولك اليوم بعد")}
              </p>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link to={createPageUrl("Exercises")}>
            <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-all" style={{ backgroundColor: "var(--surface)" }}>
              <Activity className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--primary)" }} />
              <h4 className="font-semibold" style={{ color: "var(--strong-text)" }}>
                {t("Exercises", "التمارين")}
              </h4>
            </Card>
          </Link>

          <Link to={createPageUrl("Emergency")}>
            <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-all" style={{ backgroundColor: "var(--surface)" }}>
              <AlertCircle className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--error)" }} />
              <h4 className="font-semibold" style={{ color: "var(--strong-text)" }}>
                {t("Emergency", "طوارئ")}
              </h4>
            </Card>
          </Link>
        </div>

        {/* Health Status Cards */}
       <h2 className="text-lg font-semibold text-[var(--strong-text)] mb-2">
          {t("Your Health Today", "حالة اليوم")}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <HealthCard 
            title={t("Heart Rate", "معدل القلب")}
            value="96"
            subtitle={t("BPM", "نبضة في الدقيقة")}
            icon={Heart}
            color="heartRate"
          />
          <HealthCard 
            title={t("Steps", "الخطوات")}
            value="2,300"
            subtitle={t("step", "خطوة")}
            icon={Activity}
            color="steps"
          />
          <HealthCard 
            title={t("Sleep", "النوم")}
            value="5.5"
            subtitle={t("hours", "ساعات")}
            icon={Moon}
            color="sleep"
          />
          <HealthCard 
            title={t("Mood", "المزاج")}
            value={todayCheckIn ? "😊" : "😐"}
            icon={TrendingUp}
            color={todayCheckIn ? "mood" : "noMood"}
          />
        </div>
        {/* Body Temperature Card */}
        
        <Card
        className="p-6 mt-4 w-full rounded-2xl shadow-md"
        style={{
          background: "linear-gradient(135deg, #FFF9E6 0%, #FFEFD5 100%)",
          border: "1px solid #FFE0B2",
        }}
        >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Left side: Temperature value */}
        <div className="flex items-center gap-3">
          <div className="text-4xl">  <ThermometerSun size={36} color="#D35400" /></div>
          <div>
            <h4 className="font-semibold mb-1" style={{ color: "#E67E22" }}>
              {t("Body Temperature", "درجة حرارة الجسم")}
            </h4>
            <p className="text-3xl font-bold" style={{ color: "#D35400" }}>
              36.8°C
            </p>
          </div>
        </div>

        {/* Right side: Status + Analysis */}
        <div className="flex flex-col text-sm md:text-base w-full md:w-auto">
          {/* Row for status badge + chart icon */}
          <div className="flex items-center justify-between">
            <span
              className="px-3 py-1 rounded-full font-medium text-white"
              style={{ backgroundColor: "#2ECC71" }}
            >
              {isRTL ? "طبيعي" : "Normal"}
            </span>
            <button onClick={() => setShowTrend(!showTrend)}>
              <BarChart2 size={28} color="#000000" />
            </button>
          </div>

          {/* Analysis text */}
          <div className="mt-2 text-left">
            <h5 className="font-semibold mb-1" style={{ color: "#E67E22" }}>
              {isRTL ? "تحليل" : "Analysis"}
            </h5>
            <p style={{ color: "var(--strong-text)" }}>
              {isRTL
                ? "درجة الحرارة ضمن النطاق الطبيعي. لا توجد علامات على الحمى."
                : "Temperature is within the normal range. No signs of fever."}
            </p>
          </div>
        </div>
      </div>

    {/* Trend Chart Section */}
      {showTrend && (
        <div className="mt-4 h-32">
          <h6 className="font-semibold mb-1" style={{ color: "#E67E22" }}>{isRTL ? "تطور درجة الحرارة" : "Temperature Trend"}</h6>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tempHistory}>
              <XAxis dataKey="time" />
              <YAxis domain={[36, 38]} />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#E67E22" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
</Card>


         {/* My Medications */}
      <section className="space-y-4">
        <h2 className={`text-lg font-semibold `}>
          {t("My Medications", "أدويتي")} </h2>

        <MedicationCard
          name="Tecfidera"
          dosage="240mg"
          frequency=  {t("Twice daily", "مرتان يوميا")} 
          color="info"
          time = {["9:00 AM", "9:00 PM"]}
        />
         <MedicationCard
          name="Vitamin D"
          dosage="5000 IU"
          frequency= {t("Once daily", "مرة يوميا")} 
          color="info"
           time = {["9:00 AM"]}
        />
      </section>

      {/* Upcoming Appointments */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold text-[var(--nprimary)] `}>
            {isRTL ? "المواعيد القادمة" : "Upcoming Appointments"}
          </h2>
          <Link to={createPageUrl("BookAppointment")} className="inline-block">
            <Button
              variant="outline"
              size="sm"
              className="button"
            >
              <Plus className="w-4 h-4 mr-1" />
              {isRTL ? "حجز موعد" : "Book Appointment"}
            </Button>
          </Link>
        </div>
       
        {upcomingAppointments.length === 0 ? (
            <Card className=" p-6 text-center">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className={`text-gray-500 `}>
                    {isRTL ? "لا يوجد موعد" : "No Appointments"}
              </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
                
                <AppointmentCard
                 key={appointment.id}
                  doctor={appointment.doctor_name}
                  specialty={appointment.specialty}
                  date={appointment.appointment_date}
                  time={appointment.appointment_time}
                  location={appointment.location}
                  type={appointment.type}
                />
            
            ))}        
          </div>
        )}
      </section>

       

        {/* Tip of the Day */}
        <Card className="p-6" style={{ backgroundColor: "var(--primary-100)" }}>
          <h4 className="font-semibold mb-2" style={{ color: "var(--primary)" }}>
            {t("Tip of the Day", "نصيحة اليوم")}
          </h4>
          <p style={{ color: "var(--strong-text)" }}>
            {t(
              "Stay hydrated! Drinking water regularly helps manage symptoms and improves energy levels.",
              "حافظ على رطوبة جسمك! شرب الماء بانتظام يساعد في إدارة الأعراض وتحسين مستويات الطاقة."
            )}
          </p>
        </Card>
      </div>
    </div>
  );
}
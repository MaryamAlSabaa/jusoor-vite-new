import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { CheckIn } from "../Entities/CheckIn";
import { HealthData } from "../Entities/HealthData";
// import { VoiceCheckIn } from "../Entities/CheckIn";
import { Button, Card, HealthCard } from "../components";
import { Mic, Activity, TrendingUp, AlertCircle, Heart, 
  Moon,
  Calendar,
  BookOpen,
  Dumbbell,
  Phone,
  Plus,
  Stethoscope,
  Share2,
  Pill,
  Beaker } from "lucide-react";
import { format } from "date-fns";
import { User } from "../Entities/User";

export default function Home() {
  const [user, setUser] = useState(null);
  const [todayCheckIn, setTodayCheckIn] = useState(null);
  // const [language] = useState("en");
  const [recentHealth, setRecentHealth] = useState(null);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setIsRTL(userData.language_preference === "ar");

      const today = format(new Date(), "yyyy-MM-dd");
      const checkIns = await CheckIn.filter({ check_in_date: today, created_by: userData.email });
      if (checkIns.length > 0) {
        setTodayCheckIn(checkIns[0]);
      }

      const healthData = await HealthData.list("-date", 1);
      if (healthData.length > 0) {
        setRecentHealth(healthData[0]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isRTL ? "صباح الخير" : "Good Morning";
    if (hour < 18) return isRTL ? "مساء الخير" : "Good Afternoon";
    return isRTL ? "مساء الخير" : "Good Evening";
  };

  return (
    <div className="min-h-screen p-6 pb-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
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
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68dad9aa5e121be8a4ab5da6/ba0abaca3_image.png"
            alt="Jusoor butterfly logo"
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Voice Check-In CTA */}
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
              {isRTL ? "تسجيل صوتي سريع" : "Quick Voice Check-In"}
            </h3>
            <p className="text-white text-opacity-90">
              {isRTL ? "اضغط للتحدث عن شعورك اليوم" : "Tap to tell us how you're feeling today"}
            </p>
          </Card>
        </Link>

        {/* Today's Status */}
        {todayCheckIn ? (
          <Card className="p-6" style={{ backgroundColor: "var(--surface)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--success)" }} />
              <h3 className="font-semibold text-lg" style={{ color: "var(--strong-text)" }}>
                {isRTL ? "تسجيل دخول اليوم مكتمل" : "Today's Check-In Complete"}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                  {isRTL ? "الإرهاق" : "Fatigue"}
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--strong-text)" }}>
                  {todayCheckIn.fatigue_level}/10
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                  {isRTL ? "المزاج" : "Mood"}
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
                  {isRTL ? "الألم" : "Pain"}
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
                {isRTL ? "لم تسجل دخولك اليوم بعد" : "You haven't checked in today yet"}
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
                {isRTL ? "التمارين" : "Exercises"}
              </h4>
            </Card>
          </Link>

          <Link to={createPageUrl("Emergency")}>
            <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-all" style={{ backgroundColor: "var(--surface)" }}>
              <AlertCircle className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--error)" }} />
              <h4 className="font-semibold" style={{ color: "var(--strong-text)" }}>
                {isRTL ? "طوارئ" : "Emergency"}
              </h4>
            </Card>
          </Link>
        </div>

        {/* Health Status Cards */}
       <h2 className="text-lg font-semibold text-[var(--strong-text)] mb-2">
          {isRTL ? "حالة اليوم" : "Today's Status"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <HealthCard 
            title={isRTL ? "معدل القلب": "Heart Rate"}
            value="--"
            subtitle="BPM"
            icon={Heart}
            color="primary"
          />
          <HealthCard 
            title={isRTL ? "الخطوات" : "Steps"}
            value="--"
            subtitle="steps"
            icon={Activity}
            color="success"
          />
          <HealthCard 
            title={isRTL ? "النوم" : "Sleep"}
            value="--"
            subtitle="hours"
            icon={Moon}
            color="info"
          />
          <HealthCard 
            title={isRTL ? "المزاج" : "Mood"}
            value={todayCheckIn ? "😊" : "--"}
            icon={TrendingUp}
            color={todayCheckIn ? "success" : "warning"}
          />
        </div>
         {/* My Medications */}
      <section className="space-y-4">
        <h2 className={`text-lg font-semibold text-[var(--nabdh-secondary)] ${language === 'ar' ? 'arabic-font' : ''}`}>
          {getText('myMedications')}
        </h2>
        {activeMedications.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="p-6 text-center">
              <Pill className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className={`text-gray-500 ${language === 'ar' ? 'arabic-font' : ''}`}>
                {getText('noMedications')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeMedications.map(med => <MedicationCard key={med.id} medication={med} onTake={handleTakeMedication} language={language} />)}
          </div>
        )}
      </section>

      {/* Upcoming Appointments */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold text-[var(--nabdh-secondary)] ${
            language === 'ar' ? 'arabic-font' : ''
          }`}>
            {getText('upcomingAppointments')}
          </h2>
          <Link to={createPageUrl("BookAppointment")} className="inline-block">
            <Button
              variant="outline"
              size="sm"
              className="nabdh-button"
            >
              <Plus className="w-4 h-4 mr-1" />
              {getText('bookAppointment')}
            </Button>
          </Link>
        </div>
        
        {upcomingAppointments.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="p-6 text-center">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className={`text-gray-500 ${language === 'ar' ? 'arabic-font' : ''}`}>
                {getText('noAppointments')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => {
              // Render HealthCard for specific types like 'mri_scan', 'blood_test'
              if (['mri_scan', 'blood_test'].includes(appointment.type)) {
                return (
                  <HealthCard 
                    key={appointment.id} 
                    title={getText('imaging')} // Or a more specific title based on appointment.type
                    value={new Date(appointment.appointment_date).toLocaleDateString()} 
                    subtitle={appointment.location} 
                    icon={Beaker} 
                    color="info" 
                  />
                );
              }
              return (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCall={handleCallDoctor}
                  onReschedule={handleRescheduleAppointment}
                />
              );
            })}
          </div>
        )}
      </section>

        {/* Health Summary */}
        {recentHealth && (
          <Card className="p-6" style={{ backgroundColor: "var(--surface)" }}>
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <h3 className="font-semibold text-lg" style={{ color: "var(--strong-text)" }}>
                {isRTL ? "الصحة اليوم" : "Health Today"}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {recentHealth.steps && (
                <div>
                  <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                    {isRTL ? "الخطوات" : "Steps"}
                  </p>
                  <p className="text-xl font-bold" style={{ color: "var(--strong-text)" }}>
                    {recentHealth.steps.toLocaleString()}
                  </p>
                </div>
              )}
              {recentHealth.sleep_hours && (
                <div>
                  <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                    {isRTL ? "النوم" : "Sleep"}
                  </p>
                  <p className="text-xl font-bold" style={{ color: "var(--strong-text)" }}>
                    {recentHealth.sleep_hours}h
                  </p>
                </div>
              )}
            </div>
            <Link to={createPageUrl("HealthHistory")}>
              <Button
                variant="ghost"
                className="w-full mt-4"
                style={{ color: "var(--primary)" }}
              >
                {isRTL ? "عرض السجل الكامل" : "View Full History"}
                <TrendingUp className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        )}

        {/* Tip of the Day */}
        <Card className="p-6" style={{ backgroundColor: "var(--primary-100)" }}>
          <h4 className="font-semibold mb-2" style={{ color: "var(--primary)" }}>
            {isRTL ? "نصيحة اليوم" : "Tip of the Day"}
          </h4>
          <p style={{ color: "var(--strong-text)" }}>
            {isRTL 
              ? "حافظ على رطوبة جسمك! شرب الماء بانتظام يساعد في إدارة الأعراض وتحسين مستويات الطاقة."
              : "Stay hydrated! Drinking water regularly helps manage symptoms and improves energy levels."}
          </p>
        </Card>
      </div>
    </div>
  );
}
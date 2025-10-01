import React, { useState, useEffect } from "react";
import { HealthData } from "../Entities/HealthData";
import { CheckIn } from "../Entities/CheckIn";
import { Card } from "../components";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Activity, Heart, Moon } from "lucide-react";
import { format, subDays } from "date-fns";
import { User } from "../Entities/User";

export default function HealthHistory() {
  const [user, setUser] = useState(null);
  const [isRTL, setIsRTL] = useState(false);
  const [healthData, setHealthData] = useState([]);
  const [checkInData, setCheckInData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setIsRTL(userData.language_preference === "ar");

      const health = await HealthData.list("-date", 30);
      setHealthData(health);

      const checkIns = await CheckIn.list("-check_in_date", 30);
      setCheckInData(checkIns);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const fatigueChartData = checkInData.map(item => ({
    date: format(new Date(item.check_in_date), "MMM d"),
    fatigue: item.fatigue_level,
    pain: item.pain_level || 0
  })).reverse();

  const stepsChartData = healthData.filter(item => item.steps).map(item => ({
    date: format(new Date(item.date), "MMM d"),
    steps: item.steps
  })).reverse();

  return (
    <div className="min-h-screen p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--strong-text)" }}>
            {isRTL ? "السجل الصحي" : "Health History"}
          </h1>
          <p style={{ color: "var(--muted-text)" }}>
            {isRTL ? "تتبع تقدمك عبر الزمن" : "Track your progress over time"}
          </p>
        </div>

        {/* Fatigue & Pain Trends */}
        {fatigueChartData.length > 0 && (
          <Card className="p-6" style={{ backgroundColor: "var(--surface)" }}>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <h3 className="font-semibold text-lg" style={{ color: "var(--strong-text)" }}>
                {isRTL ? "الإرهاق والألم" : "Fatigue & Pain Trends"}
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fatigueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--primary-200)" />
                <XAxis dataKey="date" stroke="var(--muted-text)" />
                <YAxis stroke="var(--muted-text)" domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--primary-200)",
                    borderRadius: "8px"
                  }}
                />
                <Line type="monotone" dataKey="fatigue" stroke="var(--primary)" strokeWidth={3} name={isRTL ? "الإرهاق" : "Fatigue"} />
                <Line type="monotone" dataKey="pain" stroke="var(--error)" strokeWidth={3} name={isRTL ? "الألم" : "Pain"} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Steps Activity */}
        {stepsChartData.length > 0 && (
          <Card className="p-6" style={{ backgroundColor: "var(--surface)" }}>
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <h3 className="font-semibold text-lg" style={{ color: "var(--strong-text)" }}>
                {isRTL ? "النشاط اليومي" : "Daily Activity"}
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stepsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--primary-200)" />
                <XAxis dataKey="date" stroke="var(--muted-text)" />
                <YAxis stroke="var(--muted-text)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--primary-200)",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="steps" fill="var(--primary)" radius={[8, 8, 0, 0]} name={isRTL ? "الخطوات" : "Steps"} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 text-center" style={{ backgroundColor: "var(--surface)" }}>
            <Heart className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--primary)" }} />
            <p className="text-sm mb-1" style={{ color: "var(--muted-text)" }}>
              {isRTL ? "متوسط معدل القلب" : "Avg Heart Rate"}
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--strong-text)" }}>
              {healthData[0]?.heart_rate_avg || "--"} <span className="text-sm">bpm</span>
            </p>
          </Card>

          <Card className="p-6 text-center" style={{ backgroundColor: "var(--surface)" }}>
            <Moon className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--primary)" }} />
            <p className="text-sm mb-1" style={{ color: "var(--muted-text)" }}>
              {isRTL ? "متوسط النوم" : "Avg Sleep"}
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--strong-text)" }}>
              {healthData[0]?.sleep_hours || "--"} <span className="text-sm">hrs</span>
            </p>
          </Card>
        </div>

        {(healthData.length === 0 && checkInData.length === 0) && (
          <Card className="p-12 text-center" style={{ backgroundColor: "var(--surface)" }}>
            <TrendingUp className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--muted-text)" }} />
            <p style={{ color: "var(--muted-text)" }}>
              {isRTL ? "لا توجد بيانات صحية بعد" : "No health data yet"}
            </p>
            <p className="text-sm mt-2" style={{ color: "var(--muted-text)" }}>
              {isRTL ? "ابدأ بتسجيل الدخول اليومي" : "Start with daily check-ins"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
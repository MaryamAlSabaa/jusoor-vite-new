import React, { useState, useEffect } from "react";
import { User } from "../Entities/User";
import { Appointment } from "../Entities/Appointments";
import { createPageUrl } from "../utils";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ChevronLeft, Save, Calendar as CalendarIcon, Clock, MapPin, User as UserIcon, Stethoscope, FileText } from "lucide-react";
import { toast } from "sonner";

export default function BookAppointment() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    doctor_name: "",
    specialty: "",
    appointment_date: null,
    appointment_time: "",
    location: "",
    type: "consultation",
    notes: ""
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setLanguage(userData.preferred_language || "en");
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const handleSubmit = async () => {
  if (!appointmentData.doctor_name || !appointmentData.appointment_date || !appointmentData.appointment_time) {
    toast.error("Please fill in Doctor Name, Date, and Time.");
    return;
  }

  setIsSubmitting(true);

  try {
    const createdAppointment = await Appointment.create({
      ...appointmentData,
      appointment_date: format(appointmentData.appointment_date, "yyyy-MM-dd"),
    });
    toast.success("Appointment booked successfully!");

    // navigate to Home and pass the new appointment
    navigate(createPageUrl("/"), { state: { newAppointment: createdAppointment } });
  } catch (error) {
    console.error("Error booking appointment:", error);
    toast.error("Failed to book appointment. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  const getText = (key, lang = language) => {
    const texts = {
      bookAppointment: { en: "Book Appointment", ar: "حجز موعد" },
      doctorName: { en: "Doctor's Name", ar: "اسم الطبيب" },
      specialty: { en: "Specialty", ar: "التخصص" },
      date: { en: "Date", ar: "التاريخ" },
      selectDate: { en: "Select a date", ar: "اختر تاريخ" },
      time: { en: "Time", ar: "الوقت" },
      timePlaceholder: { en: "e.g., 10:30 AM", ar: "مثال: 10:30 صباحاً" },
      location: { en: "Location", ar: "الموقع" },
      locationPlaceholder: { en: "e.g., Dubai Hospital", ar: "مثال: مستشفى دبي" },
      appointmentType: { en: "Appointment Type", ar: "نوع الموعد" },
      notes: { en: "Notes", ar: "ملاحظات" },
      notesPlaceholder: { en: "e.g., Discuss recent symptoms", ar: "مثال: لمناقشة الأعراض الأخيرة" },
      save: { en: "Save Appointment", ar: "حفظ الموعد" },
      routine_checkup: { en: "Routine Check-up", ar: "فحص روتيني" },
      follow_up: { en: "Follow-up", ar: "متابعة" },
      emergency: { en: "Emergency", ar: "طوارئ" },
      consultation: { en: "Consultation", ar: "استشارة" },
      therapy: { en: "Therapy", ar: "علاج طبيعي" },
      mri_scan: { en: "MRI Scan", ar: "أشعة رنين مغناطيسي" },
      blood_test: { en: "Blood Test", ar: "فحص دم" },
    };
    return texts[key] ? texts[key][lang] : key;
  };

//   const handleSubmit = async () => {
//   try {
//     setIsSubmitting(true);

//     await submitAppointment(); 
//     navigate("/"); 

//   } catch (error) {
//     console.error("Submission failed:", error);
//   } finally {
//     setIsSubmitting(false);
//   }
// };

  const appointmentTypes = ["routine_checkup", "follow_up", "emergency", "consultation", "therapy", "mri_scan", "blood_test"];

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className={`text-2xl font-bold text-[var(--nabdh-secondary)] ${language === 'ar' ? 'arabic-font' : ''}`}>
          {getText('bookAppointment')}
        </h1>
      </div>

      <Card className="nabdh-shadow border-0">
        <CardContent className="p-6 space-y-5">
          <div className="relative">
            <UserIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
            <Input 
              placeholder={getText('doctorName')}
              value={appointmentData.doctor_name}
              onChange={(e) => setAppointmentData(prev => ({...prev, doctor_name: e.target.value}))}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <Stethoscope className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
            <Input 
              placeholder={getText('specialty')}
              value={appointmentData.specialty}
              onChange={(e) => setAppointmentData(prev => ({...prev, specialty: e.target.value}))}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start font-normal text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {appointmentData.appointment_date ? format(appointmentData.appointment_date, 'PPP') : <span>{getText('selectDate')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={appointmentData.appointment_date}
                  onSelect={(date) => setAppointmentData(prev => ({...prev, appointment_date: date}))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="relative">
              <Clock className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
              <Input 
                placeholder={getText('timePlaceholder')}
                value={appointmentData.appointment_time}
                onChange={(e) => setAppointmentData(prev => ({...prev, appointment_time: e.target.value}))}
                className="pl-10"
              />
            </div>
          </div>

          <div className="relative">
            <MapPin className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
            <Input 
              placeholder={getText('locationPlaceholder')}
              value={appointmentData.location}
              onChange={(e) => setAppointmentData(prev => ({...prev, location: e.target.value}))}
              className="pl-10"
            />
          </div>

          <Select 
            value={appointmentData.type}
            onValueChange={(value) => setAppointmentData(prev => ({...prev, type: value}))}
          >
            <SelectTrigger>
              <SelectValue placeholder={getText('appointmentType')} />
            </SelectTrigger>
            <SelectContent>
              {appointmentTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {getText(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <FileText className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
            <Textarea
              placeholder={getText('notesPlaceholder')}
              value={appointmentData.notes}
              onChange={(e) => setAppointmentData(prev => ({...prev, notes: e.target.value}))}
              className="pl-10 pt-3 min-h-24 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-4 bg-gray-500 text-lg font-semibold hover:bg-gray-600 ${language === 'ar' ? 'arabic-font' : ''}`}>
        <Save className=" w-5 h-5 mr-2 " />
        {getText('save')}
      </Button>
    </div>
  );
}
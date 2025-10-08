export function createPageUrl(pageName) {
  const routes = {
    Home: "/",
    Exercises: "/exercises",
    CheckIn: "/check-in",
    CheckInForm: "/check-in-form",
    VoiceCheckIn: "/voice-check-in",
    Journal: "/journal",
    Settings: "/settings",
    Emergency: "/emergency",
    PatientReport: "/patientReport",
    BookAppointment: "/BookAppointment",
  };
  return routes[pageName] || "/";
}
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx"; 
import Home from "./Pages/Home.jsx";
import Emergency from "./Pages/Emergency.jsx";
import Exercises from "./Pages/Exercises.jsx";
import Journal from "./Pages/Journal.jsx";
import VoiceCheckIn from "./Pages/VoiceCheckIn.jsx";
import Onboarding from "./Pages/Onboarding.jsx";
import CheckIn from "./Pages/CheckIn.jsx";
import CheckInForm from "./Pages/CheckInForm.jsx";
import Settings from "./Pages/Settings.jsx";
import PatientReport from "./Pages/patientReport.jsx";
import BookAppointment from "./Pages/BookAppointment.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="emergency" element={<Emergency />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="journal" element={<Journal />} />
        <Route path="health-history" element={<PatientReport />} />
        <Route path="voice-check-in" element={<VoiceCheckIn />} />
        <Route path="settings" element={<Settings />} />
        <Route path="patientReport" element={<PatientReport />} />
        <Route path="check-in" element={<CheckIn />} />
        <Route path="check-in-form" element={<CheckInForm />} />
        <Route path="BookAppointment" element={<BookAppointment />} />
      </Route>
    </Routes>
  );
}
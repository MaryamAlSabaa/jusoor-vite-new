import React, {useState} from "react";
import {  Routes, Route } from "react-router-dom";
// react-speech-recognition is a React wrapper around the Web Speech API
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import Layout from "./Layout.jsx"; 
import Home from "./Pages/Home.jsx";
import Emergency from "./Pages/Emergency.jsx";
import Exercises from "./Pages/Exercises.jsx";
import Journal from "./Pages/Journal.jsx";
import HealthHistory from "./Pages/HealthHistory.jsx";
import VoiceCheckIn from "./Pages/VoiceCheckIn.jsx";
// import SpeechRecognition from "./Pages/SpeechRecognition.jsx";
import Onboarding from "./Pages/Onboarding.jsx";
import CheckIn from "./Pages/CheckIn.jsx";
import Settings from "./Pages/Settings.jsx";
import PatientReport from "./Pages/patientReport.jsx";
import BookAppointment from "./Pages/BookAppointment.jsx";

export default function App() {
  
  return (
      <Routes>
        {/* path = "the path we are routing to" */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Layout currentPageName="Home" />}>
          <Route index element={<Home />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="journal" element={<Journal />} />
          <Route path="health-history" element={<PatientReport />} />
          <Route path="voice-check-in" element={<VoiceCheckIn />} />
          <Route path="settings" element={<Settings />} />
          <Route path="patientReport" element={<PatientReport />} />
          <Route path="CheckIn" element={<CheckIn />} />
          <Route path="BookAppointment" element={<BookAppointment />} />

        </Route>
      </Routes>

  );
}
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx"; 
import Home from "./Pages/Home.jsx";
import Emergency from "./Pages/Emergency.jsx";
import Exercises from "./Pages/Exercises.jsx";
import Journal from "./Pages/Journal.jsx";
import HealthHistory from "./Pages/HealthHistory.jsx";
import VoiceCheckIn from "./Pages/VoiceCheckIn.jsx";
import Onboarding from "./Pages/Onboarding.jsx";
import Settings from "./Pages/Settings.jsx";

export default function App() {
  return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Layout currentPageName="Home" />}>
          <Route index element={<Home />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="journal" element={<Journal />} />
          <Route path="health-history" element={<HealthHistory />} />
          <Route path="voice-check-in" element={<VoiceCheckIn />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
  );
}

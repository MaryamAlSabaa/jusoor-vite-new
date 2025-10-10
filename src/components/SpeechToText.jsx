import { useSpeechRecognition } from "react-speech-recognition";
import React, { useState, useEffect } from "react";
import { useAccessibility } from "../Entities/AccessibilityContext";

export default function SpeechToText({ onTranscript }) {
  const { transcript: sttTranscript, listening: sttListening, resetTranscript: resetSttTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
const { isRTL, language } = useAccessibility();
  const t = (en, ar) => (isRTL ? ar : en);

    useEffect(() => {
    loadUser();
    }, [language]);
  const loadUser = async () => {
  try {
    const userData = await User.me();
    setUser(userData);
  } catch (error) {
    console.error("Error loading user:", error);
  }
  };
  React.useEffect(() => {
    if (onTranscript) onTranscript(sttTranscript);
  }, [sttTranscript, onTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        className="bg-primary text-white px-4 py-2 rounded mb-2"
        onClick={() => {
          resetSttTranscript();
          window.SpeechRecognition && window.SpeechRecognition.startListening && window.SpeechRecognition.startListening();
        }}
        disabled={sttListening}
      >
        {sttListening ? "Listening..." : ""}
      </button>
      <button
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded mb-2"
        onClick={resetSttTranscript}
        disabled={!sttTranscript}
      >
        {t("Reset", "إعادة تعيين")} 

      </button>
      
    </div>
  );
}

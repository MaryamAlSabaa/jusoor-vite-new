import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Link, Navigate  } from "react-router-dom";

export default function SpeechRecognitionPopup({ onClose }) {
  const [redirectURL, setRedirectURL] = useState("");
  
  const pages = ["Home", "Home Page", "Book Appointments", "Appointments" ,"Exercises", "Exercise", "Voice", "Journal", "Settings", "Emergency", "reports", "Check In", "Health History"];
  const urls = {
  Home: "/",                
  "Home Page": "/",
  Emergency: "/emergency",
  Exercises: "/exercises",
  Exercise: "/exercises",
  Appointments: "/BookAppointment",
  "Book Appointments": "/BookAppointment",
  Journal: "/journal",
  "Health History": "/health-history",
  Voice: "/voice-check-in",
  Settings: "/settings",
  reports: "/patientReport",
  "Check In": "/CheckIn",
};
  const [active, setActive] = useState(true);
const commands = [ {
      // redirectPage takes whatever the user says instead of the * as a parameter
      command: ["Go to *", "Open *", "Take me to *"],
      callback: (spoken) => {
        const lowerSpoken = spoken.toLowerCase();
        
        // finding link match, ignoring case sensitivity 
        const matchedPage = Object.keys(urls).find((p) => lowerSpoken.includes(p.toLowerCase()));

        // storing original-cased version for redirection 
        if (matchedPage) setRedirectURL(matchedPage);
        else setRedirectURL("not-found");
      }
    }];
  const {transcript} = useSpeechRecognition({commands}); // commands: array of objects

// let redirect = "";
// if (redirectURL){
//     if (pages.includes(formattedPage)){
//         redirect = <Navigate to={urls[formattedPage]} replace={true} />;
// }
// else {
//     redirect = <p>Could not find page: {formattedPage}</p>
// }
// }
let redirect = "";
if (redirectURL) {
  if (redirectURL === "not-found") {
    redirect = <p>Could not find a matching page.</p>;
  } else {
    redirect = <Navigate to={urls[redirectURL]} replace />;
  }
}

  React.useEffect(() => {
    // if (active) {
      window.document.body.style.overflow = "hidden";
    // } else {
      window.document.body.style.overflow = "auto";
    // }
    // starts listening 
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });

    return () => {
      SpeechRecognition.stopListening();
      document.body.style.overflow = "auto";

    };
  }, []);
React.useEffect(() => {
  if (redirectURL && redirectURL !== "not-found") {
    SpeechRecognition.stopListening();
   onClose();
    
  }
}, [redirectURL, onClose]);
  if (!active) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.3)",
      backdropFilter: "blur(6px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "white",
        borderRadius: "1rem",
        padding: "2rem 3rem",
        boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "1rem" }}>Speak, Jusoor is hearing you...</h2>
        <button onClick={() => { setActive(false); onClose && onClose(); }} style={{ marginTop: "1rem", padding: "0.5rem 1.5rem", borderRadius: "0.5rem", background: "#00A29D", color: "white", border: "none" }}>Close</button>
        <div style={{ marginTop: "1rem", color: "#666" }}>
          <strong>Transcript:</strong> {transcript}
        </div>
        {redirect}

      </div>
    </div>
  );
}

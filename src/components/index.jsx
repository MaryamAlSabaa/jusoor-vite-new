import React, { useState } from "react";
import { Pill, Check, Bell } from "lucide-react";

export const Button = ({ children, onClick, variant, style, ...props }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        border: variant === "ghost" ? "1px solid #ccc" : "none",
        cursor: "pointer",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Card
export const Card = ({ children, style, className = "" }) => {
  return (
    <div
      className={`shadow-md p-4 rounded-lg ${className}`}
      style={{
        backgroundColor: "#fff",
        ...style,
      }}
    >
      {children}
    </div>
  );
};


export function MedicationCard({
  name,
  dosage,
  frequency,
  color = "primary",
  medication,
  time=[],
  onTake = () => {},
  language = "en",
  getText = (key) => key,
}) {
  const [taken, setTaken] = useState(false);

  const handleTake = () => {
    setTaken(true);
    onTake(medication);
  };

  const colorMap = {
    primary: "bg-teal-500 text-white",
    success: "bg-green-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-400 text-black",
  };

  return (
    <div className="relative rounded-lg shadow-sm border-0 transition-all duration-300 bg-gray-50">
      <div className="p-4">
        {/* Top right take button */}
        <div className="absolute top-3 right-3">
          <Button
            size="sm"
            onClick={handleTake}
            disabled={taken}
            className={`button flex items-center gap-1 ${
              taken
                ? " text-black hover:bg-blue-500"
                : " text-black"
            }`}
            style={!taken ? { background: "var(--primary-300)" } : {background: "var(--primary-100)"}}

          >
            {taken ? (
              <Check className="w-4 h-4" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
            <span className={`${language === "ar" ? "arabic-font" : ""}`}>
              {taken ? getText("taken") : getText("take")}
            </span>
          </Button>
        </div>

        {/* Main content */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Pill className="w-5 h-5 text-[var(--primary-200)]" />
              <h3 className="font-semibold text-[var(--primary)]">
                {name }
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {dosage } – {frequency}
            </p>
             {/* Display each time in its own badge */}
            <div className="flex gap-2 flex-wrap">
              {Array.isArray(time) &&
                time.map((t, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold 
                    transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-clock w-3 h-3 mr-1"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {t}
                  </div>
                ))}
            </div>
          </div>
          {/* <div
            className={`w-10 h-10 flex items-center justify-center rounded-full ${colorMap[color]}`}
          > */}
            <Pill className="w-4 h-4" />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}


export const Switch = ({ checked, onCheckedChange, style = {}, ...props }) => {
  const toggle = () => onCheckedChange && onCheckedChange(!checked);

  return (
    <div
      onClick={toggle}
      style={{
        width: "40px",
        height: "20px",
        borderRadius: "20px",
        backgroundColor: checked ? "#4ade80" : "#ccc",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.2s",
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: checked ? "22px" : "2px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
        }}
      ></div>
    </div>
  );
};
export function HealthCard({ title, value, subtitle, icon: Icon, color }) {
const colorMap = {
  heartRate: "bg-[#F4D6D8] text-[#5A2E2E]", // Pale rose with muted text
  steps: "bg-[#D8EAD2] text-[#2E402E]",      // Misty green with dark olive text
  sleep: "bg-[#D8D6F2] text-[#3A3A58]",      // Soft lavender with slate text
  mood: "bg-[#F9E0D9] text-[#5A3B35]",       // Gentle peach with soft brown text
};

  return (
      <div
      className={`p-6 rounded-xl shadow flex items-center justify-between ${colorMap[color] || "bg-gray-200"}`}
    >
      {/* Left: Text */}
      <div className="flex-1 pr-4">
        <p className=" text-lg font-semibold">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {subtitle && <span className="text-sm opacity-80">{subtitle}</span>}
      </div>

      {/* Right: Icon */}
      {Icon && (
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8" />
        </div>
      )}
    </div>
  );
}

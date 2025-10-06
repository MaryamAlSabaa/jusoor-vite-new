import React from "react";

// Simple Button
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
export function MedicationCard({ name, dosage, frequency, icon: Icon, color }) {
  const colorMap = {
    primary: "bg-teal-500 text-white",
    success: "bg-green-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-400 text-black",
  };

  return (
    <div className="rounded-lg text-card-foreground shadow-sm nabdh-shadow border-0 transition-all duration-300 bg-white">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {/* FIXED: Changed stroke-linecap to strokeLinecap, stroke-linejoin to strokeLinejoin */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="lucide lucide-pill w-4 h-4 text-[var(--nabdh-primary)]">
                <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
                <path d="m8.5 8.5 7 7"></path>
              </svg>
              <h3 className="font-semibold text-[var(--nabdh-secondary)]">Tecfidera</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">240mg - Twice Daily</p>
          </div>
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
    primary: "bg-teal-500 text-white",
    success: "bg-green-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-400 text-black",
  };

  return (
      <div
      className={`p-6 rounded-xl shadow flex items-center justify-between ${colorMap[color] || "bg-gray-200"}`}
    >
      {/* Left: Text */}
      <div className="flex-1 pr-4">
        <p className="text-white/80 text-lg font-semibold">{title}</p>
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

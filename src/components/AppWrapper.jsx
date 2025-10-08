import { useAccessibility } from "../Entities/AccessibilityContext"; // adjust path

export default function AppWrapper({ children }) {
  const { fontSize, lineHeight, letterSpacing, bold } = useAccessibility();

  return (
    <div style={{
      fontSize: `${fontSize}px`,
      lineHeight: lineHeight,
      letterSpacing: `${letterSpacing}px`,
      fontWeight: bold ? "bold" : "normal"
    }}>
      {children}
    </div>
  );
}

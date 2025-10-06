export function createPageUrl(pageName) {
  switch (pageName) {
    case "Home":
      return "/";
    case "Journal":
      return "/journal";
    case "Exercises":
      return "/exercises";
    case "Emergency":
      return "/emergency";
    case "HealthHistory":
      return "/health-history";
    case "VoiceCheckIn":
      return "/voice-check-in";
    case "Settings":
      return "/settings";
    default:
      return "/";
  }
}


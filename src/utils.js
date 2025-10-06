export const createPageUrl = (pageName) => {
  const routes = {
    'Home': '/',
    'Exercises': '/exercises',
    'checkin': '/checkin',
    'CheckIn': '/checkin',
    'checkin-form': '/checkin-form', // ADD this
    'Journal': '/journal',
    'Settings': '/settings',
    'Emergency': '/emergency',
    'VoiceCheckIn': '/voice-check-in',
    'CheckInForm': '/checkin-form',
    'HealthHistory': '/health-history',
    'Onboarding': '/onboarding'
  };
  
  return routes[pageName] || '/';
};
# Jusoor MS Companion

Jusoor is a modern web application designed to support MS patients in managing their health, appointments, and daily activities. Built with React, Vite, and Tailwind CSS, it offers a clean, accessible, and multilingual experience.

## Features

- **Home Dashboard**: View daily check-in, health stats, medications, upcoming appointments, and tips.
- **Voice Check-In**: Record your daily status using speech recognition.
- **Journal**: Log your thoughts and feelings with speech-to-text support.
- **Health History**: Review your health data and trends.
- **Medications**: Track and mark medication intake.
- **Appointments**: Book, view, and manage upcoming appointments.
- **Reports**: Generate and share patient reports.
- **Emergency**: Quick access to emergency contacts and location sharing.
- **Settings**: Manage language, accessibility, health sync, and emergency location options.
- **Accessibility**: Adjustable font size, line height, letter spacing, and bold text via context.
- **RTL Support**: Full support for Arabic and English languages.

## Tech Stack

- **React** (with Vite)
- **Tailwind CSS**
- **Lucide Icons**
- **react-speech-recognition** (voice features)
- **recharts** (charts and data visualization)

## Project Structure

```
├── public/
├── src/
│   ├── assets/                # Images and icons
│   ├── components/           # Reusable UI components (Card, Button, AppointmentCard, etc.)
│   ├── Entities/             # Data models and context (User, Journal, HealthData, AccessibilityContext, etc.)
│   ├── Pages/                # Main app pages (Home, Journal, BookAppointment, Settings, etc.)
│   ├── utils.js              # Utility functions
│   ├── App.jsx               # Main app entry
│   ├── Layout.jsx            # App layout and navigation
│   └── ...
├── package.json
├── tailwind.config.js
├── vite.config.js
├── README.md
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open in browser:**
   Visit `http://localhost:5173` (or the port shown in your terminal).

## Accessibility & Customization
- Accessibility settings are managed via context and can be changed in the Settings page.
- Language preference (English/Arabic) is available in Settings.
- All main features are accessible from the bottom navigation bar.

## Voice Commands
- Use the voice agent popup to navigate: e.g., "Go to Home", "Open Journal", etc.
- Journal and voice check-in support speech-to-text for easy entry.

## Contributing
Pull requests and suggestions are welcome! Please follow best practices and keep code modular.

## License
MIT

---
Made with love for MS patients 🦋

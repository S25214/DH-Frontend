# DigitalHuman Frontend

Production-ready static web application for managing DigitalHuman configurations and connecting to PixelStreaming avatars.

## Features

- 🔐 Firebase Authentication with Google/Email sign-in
- 🔄 Automatic Botnoi Voice token exchange
- 📝 CRUD operations for DH/A2F/Customize configs
- 🎭 DigitalHuman SDK integration
- 🎨 Modern dark-themed UI with TailwindCSS

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication > Email/Password and Google providers
3. Copy `.env.example` to `.env` and fill in your Firebase credentials

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── services/           # Firebase, Auth, API services
├── hooks/              # Custom React hooks (useDigitalHuman)
├── components/         # Reusable components (Navbar, Toast, etc.)
├── pages/              # Main pages (HomePage, Dashboard, ConnectPage)
├── App.jsx             # Main app with routing
└── main.jsx            # Entry point
```

## Environment Variables

Required variables in `.env`:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Tech Stack

- **Framework**: React + Vite
- **Routing**: React Router v7
- **Styling**: TailwindCSS
- **Authentication**: Firebase Auth
- **API**: Botnoi Voice backend
- **3D Streaming**: DigitalHuman PixelStreaming SDK

## License

Proprietary - All rights reserved
